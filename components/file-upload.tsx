import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

type Props = {
    onChange: (url: string) => void;
    endpoint: keyof typeof ourFileRouter;
};

export const FileUpload = ({ onChange, endpoint }: Props) => {
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                console.log(res);
                onChange(res[0].url);
            }}
            onUploadError={(error: Error) => {
                toast.error(error.message);
            }}
        />
    );
};
