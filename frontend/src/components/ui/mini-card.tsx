import {Card, CardFooter, Image, Button} from "@nextui-org/react";

interface MiniCardProps{
    imageUrl : string,
    educatorName : string,
    courseName : string,
}
const MiniCard : React.FC<MiniCardProps> = (props) => {
  return (
    <Card
      isFooterBlurred
      radius="lg"
      className="border-none relative "
    >
        <div className="relative size-10 w-full h-full p-2">
            <Image
            isBlurred
            width={150}
            height={150}
            src={props.imageUrl}
            alt="NextUI Album Cover"
            className="z-0 object-cover"
            />
        </div>
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 px-2">
        <p className="text-tiny text-white/80 ">{props.educatorName}</p>
        <Button className="text-tiny text-white bg-black/20 font-ubuntu" variant="flat" color="default" radius="lg" size="sm">
          {props.courseName}
        </Button>
      </CardFooter>
      
    </Card>
  );
}

export default MiniCard;