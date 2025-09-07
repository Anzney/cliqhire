// "use client";

//     >
//       <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-lg">
//         {icon}
//       </div>
//       <span className="text-lg font-semibold">{title}</span>
//     </Button>
//   );
// }

// interface CreateCandidateModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onCandidateCreated?: (candidate: any) => void;
// }
//                 setShowForm(false);
//                 onClose();
//               }}
//             />
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
//               <OptionCard
//                 icon={<FileText className="w-8 h-8 text-blue-600" />}
//                 title="Complete a Form"
//                 onClick={() => setShowForm(true)}
//               />
//               <OptionCard
//                 icon={<Upload className="w-8 h-8 text-blue-600" />}
//                 title="Upload a Resume"
//                 onClick={() => {
//                   /* You can implement resume upload logic here */
//                 }}
//               />
//             </div>
//             <div className="text-center text-gray-600 pt-4">
//               Or{" "}
//               <Link href="#" className="text-blue-600 hover:underline">
//                 install a chrome extension
//               </Link>{" "}
//               to source candidates from LinkedIn.
//             </div>
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }



// "use client";

// import { X, FileText, Upload } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// // import Link from "next/link";
// import { useState } from "react";
// import CreateCandidateform from "./create-candidate-form";
// // interface CreateCandidateModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// // }

// interface CreateCandidateModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onCandidateCreated?: (candidate: any) => void;
// }

// interface OptionCardProps {
//   icon: React.ReactNode;
//   title: string;
//   onClick: () => void;
// }

// function OptionCard({ icon, title, onClick }: OptionCardProps) {
//   return (
//     <Button
//       variant="outline"
//       className="h-auto flex flex-col items-center gap-6 p-8 hover:border-gray-400 hover:bg-gray-200"
//       onClick={onClick}
//     >
//       <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
//         {icon}
//       </div>
//       <span className="text-lg font-semibold">{title}</span>
//     </Button>
//   );
// }



// export function CreateCandidateModal({
//   isOpen,
//   onClose,
//   onCandidateCreated,
// }: CreateCandidateModalProps) {
//   const [showForm, setShowForm] = useState(false);
//   const [showAdvanced, setShowAdvanced] = useState(false);
//   return (
//     <Dialog
//       open={isOpen}
//       onOpenChange={() => {
//         setShowForm(false);
//         setShowAdvanced(false);
//         onClose();
//       }}
//     >
//       <DialogContent className={`max-w-3xl${showAdvanced ? ' w-full h-[80vh] max-h-[80vh] overflow-y-auto flex flex-col justify-center items-center' : ''}`}>
//         <DialogHeader>
//           {/* <div className="flex items-center justify-between"> */}
//             <DialogTitle className="text-xl">Create Candidate</DialogTitle>
//           {/* </div> */}
//         </DialogHeader>
//         {showForm ? (
//           // <div>
//             <CreateCandidateform
//               showAdvanced={showAdvanced}
//               setShowAdvanced={setShowAdvanced}
//               onCandidateCreated={(candidate: any) => {
//                 if (onCandidateCreated) onCandidateCreated(candidate);
//                 setShowForm(false);
//                 onClose();
//               }}
//             />
//           // </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
//               <OptionCard
//                 icon={<FileText className="w-8 h-8 text-gray-600 " />}
//                 title="Complete a Form"
//                 onClick={() => setShowForm(true)}
//               />
//               <OptionCard
//                 icon={<Upload className="w-8 h-8 text-gray-600" />}
//                 title="Upload a Resume"
//                 onClick={() => {
//                   /* You can implement resume upload logic here */
//                 }}
//               />
//             </div>
//             {/* <div className="text-center text-gray-600 pt-4">
//               Or
//               <Link href="#" className="text-blue-600 hover:underline">
//                 install a chrome extension
//               </Link>
//               to source candidates from LinkedIn.
//             </div> */}
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }






"use client";

import { FileText, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreateCandidateForm from "./create-candidate-form";
import { UploadResume } from "./UploadResume";

interface CreateCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCandidateCreated?: (candidate: any) => void;
  tempCandidateData?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    description?: string;
    gender?: string;
    dateOfBirth?: string;
    country?: string;
    nationality?: string;
    willingToRelocate?: string;
  };
}

interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

function OptionCard({ icon, title, onClick }: OptionCardProps) {
  return (
    <Button
      variant="outline"
      className="h-auto flex flex-col items-center gap-6 p-8 hover:border-gray-400 hover:bg-gray-200"
      onClick={onClick}
    >
      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
        {icon}
      </div>
      <span className="text-lg font-semibold text-gray-800">{title}</span>
    </Button>
  );
}

export function CreateCandidateModal({
  isOpen,
  onClose,
  onCandidateCreated,
  tempCandidateData,
}: CreateCandidateModalProps) {
  const [showForm, setShowForm] = useState(!!tempCandidateData);
  const [showUpload, setShowUpload] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(!!tempCandidateData);
  const [candidateSummary, setCandidateSummary] = useState<any | null>(null);

  // Reset summary on dialog close
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowForm(false);
      setShowAdvanced(false);
      setCandidateSummary(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleDialogClose}
    >
      <DialogContent
        className={`max-w-3xl ${
          showAdvanced ? "w-full h-[80vh] max-h-[80vh] " : ""
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl sticky">Create Candidate</DialogTitle>
        </DialogHeader>

        {candidateSummary ? (
          <div className="p-6 flex flex-col items-center gap-6">
            <h2 className="text-2xl font-bold text-green-700">Candidate Created!</h2>
            <div className="bg-gray-50 rounded-lg shadow p-6 w-full max-w-md">
              <div className="mb-2"><span className="font-semibold">Name:</span> {candidateSummary.name}</div>
              <div className="mb-2"><span className="font-semibold">Phone:</span> {candidateSummary.phone}</div>
              <div className="mb-2"><span className="font-semibold">Email:</span> {candidateSummary.email}</div>
              <div className="mb-2"><span className="font-semibold">Location:</span> {candidateSummary.location}</div>
              <div className="mb-2"><span className="font-semibold">Description:</span> {candidateSummary.description}</div>
            </div>
            <Button
              variant="outline"
              onClick={() => setCandidateSummary(null)}
              className="mt-4"
            >Back to Options</Button>
          </div>
        ) : showForm ? (
          <CreateCandidateForm
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            onCandidateCreated={(candidate: any) => {
              if (onCandidateCreated) onCandidateCreated(candidate);
              setCandidateSummary(candidate);
              setShowForm(false);
            }}
            goBack={() => setShowForm(false)}
            onClose={onClose}
            tempCandidateData={tempCandidateData}
          />
        ) : showUpload ? (
          <UploadResume
            open={showUpload}
            onClose={() => setShowUpload(false)}
            goBack={() => setShowUpload(false)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <OptionCard
              icon={<FileText className="w-8 h-8 text-gray-600" />}
              title="Complete a Form"
              onClick={() => {
                setShowForm(true);
                setShowUpload(false);
              }}
            />
            <OptionCard
              icon={<Upload className="w-8 h-8 text-gray-600" />}
              title="Upload a Resume"
              onClick={() => {
                setShowUpload(true);
                setShowForm(false);
              }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
