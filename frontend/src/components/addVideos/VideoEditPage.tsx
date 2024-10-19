/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { Button } from "@nextui-org/react";
import {IUpdateVideoData, IVideoData, videoDataTemplate } from "@/constants";
import { VIDEO_API } from "@/lib/env";
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import { useAuthContext } from "@/context/authContext";
import { getVerifiedToken } from "@/lib/cookieService";
import DisplayVideoCardIntoPage from "./DisplayVideoCardIntoPage";
import EditYoutubeVideoForm from "./EditYoutubeVideoForm";
import EditPersonalVideoForm from "./EditPersonalVideoForm";
import VideoPreviewCard from "./VideoPreviewCard";
import { TimeStamp } from "./AddTimeStamps";

const VideoEditPage: React.FC = () => {
  const location = useLocation();
  const [videoData, setVideoData] = useState<IVideoData>(videoDataTemplate);
  const [videoId , setVideoId] = useState<string>()
  const [activeEditor, setActiveEditor] = useState("markdown");
  const [finalTimeStampData, setFinalTimeStampData] = useState<TimeStamp[]>([]);
  const [markdown, setMarkdown] = useState<string>("");
  const [preview, setPreview] = useState<string>(videoData?.thumbnail);
  // const [isPlayerReady , setIsPlayerReady] = useState<boolean>(false);
  const { userData } = useAuthContext();

  const fetchVideoById = useCallback(async () => {
    if (!videoId) return;

    try {
      const response = await axios.get(
        `${VIDEO_API}/get-video-by-id?videoId=${videoId}`
      );
      if (response?.data?.success) {
        setVideoData(response.data.video);
        setPreview(response.data.video.thumbnail);
        setFinalTimeStampData(response.data.video.videoTimeStamps);
        setMarkdown(response.data.video.markdownContent);
        // setIsPlayerReady(true);
      } else {
        ErrorToast(response.data.message);
      }
    } catch (error: any) {
      ErrorToast(error?.response.data.message || "Something went wrong");
    }
  }, [videoId]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const videoIdFromParams = queryParams.get("videoId");
    if (videoIdFromParams) setVideoId(videoIdFromParams);
    fetchVideoById();
  }, [fetchVideoById, location.search]);

  const handleSave = async () => {

    const jwt = getVerifiedToken();

    if(!jwt){
        ErrorToast("Unauthorized");
        return;
    }
    
    const type = videoData?.videoType.toLowerCase();
     
    if(!videoId){
        return
    }
    if (type && !["youtube", "personal"].includes(type)) {
      return;
    }

    try {
      const updatedVideo: IUpdateVideoData = {
        ...videoData,
        markdownContent: markdown,
      };
      
      const formData = new FormData();
      formData.append("videoId", videoId);
      formData.append("courseName", updatedVideo.videoName);
      formData.append("tutorName", updatedVideo.tutorName);
      if(updatedVideo && updatedVideo.description) formData.append("description", updatedVideo.description);
      formData.append("markdownContent", markdown);
      if(finalTimeStampData !== undefined) formData.append("videoTimeStamps" , JSON.stringify(finalTimeStampData))
      
      if (updatedVideo.thumbnail instanceof File) {
        const blob = new Blob([updatedVideo.thumbnail], {
          type: updatedVideo.thumbnail.type,
        });
        if(type === "youtube"){
          formData.append("youtubeVideoImage", blob, updatedVideo.thumbnail.name);
        }
        else if(type === "personal"){
          formData.append("personalVideoImage", blob, updatedVideo.thumbnail.name);
        }
    
      } else {
        if(type === "youtube"){
          formData.append("youtubeVideoImage", updatedVideo.thumbnail);
        }
        else if(type === "personal"){
          formData.append("personalVideoImage", updatedVideo.thumbnail);
        }
      }

      if (updatedVideo.videoUrl instanceof File) {
        const blob = new Blob([updatedVideo.videoUrl], {
          type: updatedVideo.videoUrl.type,
        });
        if(type === "personal"){
          formData.append("personalVideoFile", blob, updatedVideo.videoUrl.name);
        }
      } else {
        if(type === "youtube"){
          formData.append("youtubeVideoFile", updatedVideo.videoUrl);
        }
      }

      const response = await axios.put(
        `${VIDEO_API}/update-video/${type}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response && response.data && response.data.success) {
        SuccessToast(response.data.message);
      } else {
        ErrorToast(response.data.message);
      }
      setVideoData(updatedVideo as IVideoData);
      fetchVideoById();

    } catch (error: any) {
      ErrorToast(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEditCourse = (updatedVideo: any) => {
    setVideoData((c) => ({
      ...c,
      ...updatedVideo,
    }));
  };

  const handleTimeStampsEdit = (timeStamps : TimeStamp[]) => {
    setFinalTimeStampData(timeStamps)
  }

  const handlePreviewCardImage = (preview: string) => {
    setPreview(preview);
  };
  
  if (!videoData) return <p>Loading course data...</p>; 
  
  return (
    <div className="flex flex-col w-full mx-auto p-10 min-h-screen bg-gray-100 dark:bg-gray-900   overflow-auto hide-scrollbar">
      <div className="flex w-full mx-auto  overflow-auto hide-scrollbar  relative overflow-x-hidden break-words">
        {/* Left Section: Editable Content */}

        <div className="flex-1 p-8 space-y-2 overflow-auto font-ubuntu w-full relative">
            <VideoPreviewCard videoData={videoData}/>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            {videoData.videoName || "Course Name"}
          </h1>

          <h2 className="text-2xl text-gray-600 dark:text-white font-medium">
            {videoData.tutorName || "Tutor Name"}
          </h2>
          <p className="text-lg text-gray-800 dark:text-gray-300 w-full">
            {videoData.description || "Description"}
          </p>

          {markdown && (
            <div className="w-full text-black dark:text-white mt-6 bg-transparent ">
              <MDEditor.Markdown
                source={markdown}
                className="prose dark:prose-invert bg-transparent font-ubuntu text-black dark:text-white"
              />
            </div>
          )}
          
        </div>

        {/* Right Section: Course Card */}
        <DisplayVideoCardIntoPage
          videoData={videoData}
          timeStamps={finalTimeStampData}
          previewImage={preview}
        />
      </div>
      {videoData.uploadedBy === userData.id && (
        <>
          {videoData.videoType === "YOUTUBE" && (
            <EditYoutubeVideoForm
              video={videoData}
              timestamp={finalTimeStampData}
              onEditVideo={handleEditCourse}
              onEditTimeStamps={handleTimeStampsEdit}
              setVideoCardImagePreview={handlePreviewCardImage}
            />
          )}
          {videoData.videoType === "PERSONAL" && (
            <EditPersonalVideoForm
              video={videoData}
              timestamp={finalTimeStampData}
              onEditVideo={handleEditCourse}
              onEditTimeStamps={handleTimeStampsEdit}
              setVideoCardImagePreview={handlePreviewCardImage}
            />
          )}

          {/* Markdown Editor */}
          <div className="bg-transparent mt-6 w-full ">
          <div className="flex space-x-4 mb-4">
              <div
                onClick={() => setActiveEditor("markdown")}
                className={`flex-1 cursor-pointer p-4 rounded-lg transition-all duration-300 ease-in-out space-y-1 ${
                  activeEditor === "markdown"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-300 dark:bg-gray-700 dark:text-white"
                }`}
              >
                <h3 className="font-ubuntu text-xl font-semibold">Markdown Editor</h3>
                <p className="font-ubuntu text-base text-gray-600 dark:text-gray-100">
                  Write using Markdown syntax. Perfect for formatting text with headers, lists, links, and images easily. 
                  <br /> 
                  <i className="font-libre">*Ideal for documentation, notes, and quick text editing!*</i>
                </p>
              </div>
              <div
                onClick={() => setActiveEditor("quill")}
                className={`flex-1 cursor-pointer p-4 rounded-lg transition-all duration-300 ease-in-out space-y-1 ${
                  activeEditor === "quill"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-300 dark:bg-gray-700 dark:text-white"
                }`}
              >
                <h3 className="font-ubuntu text-xl font-semibold">Quill Editor</h3>
                <p className="font-ubuntu text-base text-gray-600 dark:text-gray-100">
                  Rich text editor with various formatting options. Easily create styled content with bold, italics, lists, and more. 
                  <br /> 
                  <i className="font-libre">*Great for blogs, articles, and any content requiring complex formatting!*</i>
                </p>
              </div>
            </div>

            {activeEditor === "markdown" ? (
              <MDEditor
                value={markdown}
                height={500}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
                className="bg-transparent text-black dark:text-white"
                onChange={(value) => setMarkdown(value || "")}
              />
            ) : (
              <div className="w-full border-[1px] border-slate-800 dark:border-white-500 rounded-xl min-h-40 justify-center items-center flex ">
                <h1 className="text-xl font-ubuntu">
                  Quill is under maintainance
                </h1>
              </div>
            )}
          </div>
          <Button
            onClick={handleSave}
            className="my-4 w-full font-medium text-lg bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload Changes
          </Button>
        </>
      )}
    </div>
  );
};
export default VideoEditPage;
