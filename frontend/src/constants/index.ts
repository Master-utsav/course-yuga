export const NavItemsArray = [
    {
        id: 1,
        name: "Homepage",
        href: "/"
    },
    {
        id: 2,
        name: "Courses",
        href: "/courses"
    },
    {
        id: 3,
        name: "Community",
        href: "/community"
    },
    {
        id: 4,
        name: "About",
        href: "/about"
    },
    {
        id: 5,
        name: "Contact-us",
        href: "/Contact"
    },
]

export const heroContent = {
    h1Heading: "Master New Skills with",
    h1Heading2: "Course-Yuga",
    description : ["Are you ready to leave the stress of all-nighters behind? Imagine mastering skills with ease, without the burnout or late-night struggles. Course-Yuga helps you get there, guiding you step-by-step to success." , "Tired of endless textbooks and confusing lectures? With Course-Yuga, we break down even the toughest concepts into bite-sized lessons, so you can learn faster, smarter, and more effectively." , "Whether you're a beginner or looking to level up, Course-Yuga tailors your learning experience to your pace and needs. Join thousands who have already transformed their skillsets and take the first step toward your future."],
    buttonText : "Get Started",
    userCount: "42K +"
}

export const usersTooltip = [
    {
        id: 1,
        userProfileLink: "https://masterutsav.in",
        userName: "Utsav Jaiswal",
        image: "https://avatars.githubusercontent.com/u/133480549?v=4",
        courseName: "Cohort 3.0",
    },
    {
        id: 2,
        userProfileLink: "https://masterutsav.in",
        userName: "Abhishek Arya",
        image: "https://i.pinimg.com/736x/87/3a/c6/873ac673ebd640c26dbfe65d13f5c625.jpg",
        courseName: "Love Babbar",
    },
    {
        id: 3,
        userProfileLink: "https://masterutsav.in",
        userName: "Jatin Kushwah",
        image: "images/jatin.jpg",
        courseName: "Apna College DSA",
    },
  
]
export const educatorsInfiniteScrollData = [
    {
        id: 1,
        educatorName: "Harkirat Singh",
        imageUrl: "https://appxcontent.kaxa.in/paid_course3/2024-07-07-0.07833836520330406.png",
        courseName: "Cohort 3.0",
    },
    {
        id: 2,
        educatorName: "Love Babbar",
        imageUrl: "https://s3-ap-northeast-1.amazonaws.com/teamblindstatics/link/2/bad3237833b617f4da3b2799bb008077_1632020209322_res.jpeg",
        courseName: "Supreme 2.0",
    },
    {
        id: 3,
        educatorName: "Apna College",
        imageUrl: "https://www.mypunepulse.com/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-27-at-2.11.07-PM-768x512.jpeg",
        courseName: "Alpha 3.0",
    },
    {
        id: 4,
        educatorName: "Hitesh Chaudary",
        imageUrl: "https://cdn.prod.website-files.com/61a0a26a75358d70b0bf68f9/634fcf3453b051f981d67f82_person-image.jpeg",
        courseName: "JavaScript",
    },
    {
        id: 5,
        educatorName: "Adrian Hajdin",
        imageUrl: "https://avatars.githubusercontent.com/u/24898559?v=4",
        courseName: "JS Mastery",
    },
    {
        id: 6,
        educatorName: "Harkirat Singh",
        imageUrl: "https://appxcontent.kaxa.in/paid_course3/2024-07-07-0.07833836520330406.png",
        courseName: "Cohort 3.0",
    },
    {
        id: 7,
        educatorName: "Love Babbar",
        imageUrl: "https://s3-ap-northeast-1.amazonaws.com/teamblindstatics/link/2/bad3237833b617f4da3b2799bb008077_1632020209322_res.jpeg",
        courseName: "Supreme 2.0",
    },
    {
        id: 8,
        educatorName: "Apna College",
        imageUrl: "https://www.mypunepulse.com/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-27-at-2.11.07-PM-768x512.jpeg",
        courseName: "Alpha 3.0",
    },
    {
        id: 9,
        educatorName: "Hitesh Chaudary",
        imageUrl: "https://cdn.prod.website-files.com/61a0a26a75358d70b0bf68f9/634fcf3453b051f981d67f82_person-image.jpeg",
        courseName: "JavaScript",
    },
    {
        id: 10,
        educatorName: "Adrian Hajdin",
        imageUrl: "https://avatars.githubusercontent.com/u/24898559?v=4",
        courseName: "JS Mastery",
    },
]

export interface LoginUserDataProps{
        userName: string;
        email: string;
        firstName: string;
        lastName: string;
        emailVerificationStatus: boolean;
        profileImageUrl: string;
}
