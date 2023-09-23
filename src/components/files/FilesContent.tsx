import { FilesMainContent } from "./FilesMainContent";

interface ContentProps {
  title: string;
}

export function FilesContent(props: ContentProps) {

    // Mock data for testing
  const mockFiles = [
    {
      name: "Document 1",
      createdOn: "2023-09-25",
      type: "PDF",
    },
    {
      name: "Presentation",
      createdOn: "2023-09-24",
      type: "PPT",
    },
    {
      name: "Spreadsheet",
      createdOn: "2023-09-23",
      type: "XLS",
    },
    {
      name: "Image 1",
      createdOn: "2023-09-22",
      type: "JPG",
    },
    {
      name: "Document 2",
      createdOn: "2023-09-21",
      type: "PDF",
    },
  ];

  return (
    <div className="flex flex-wrap">
      <FilesMainContent title={props.title} files={mockFiles}/>
      <div className="mt-8 w-full lg:mt-0 lg:w-4/12 lg:pl-4">
        <div className="rounded-3xl bg-gray-800 px-6 pt-6">
          <div className="flex pb-6 text-2xl font-bold text-white">
            <p>Client Messages</p>
          </div>
          <div>
            <div className="flex w-full border-t border-gray-700 p-4 hover:bg-gray-700 2xl:items-start">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                alt="profile image"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="w-full pl-4">
                <div className="flex w-full items-center justify-between">
                  <div className="font-medium text-white">Stephanie</div>
                  <div className="flex h-7 w-7 cursor-pointer items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>
                <p className="my-2 text-sm text-gray-400">
                  I got your first assignment. It was quite good. 🥳 We can
                  continue with the next assignment.
                </p>
                <p className="text-right text-sm text-gray-400">Dec, 12</p>
              </div>
            </div>
            <div className="flex w-full border-t border-gray-700 p-4 hover:bg-gray-700 2xl:items-start">
              <img
                src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                alt="profile image2"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="w-full pl-4">
                <div className="flex w-full items-center justify-between">
                  <div className="font-medium text-white">Mark</div>
                  <div className="flex h-7 w-7 cursor-pointer items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>
                <p className="my-2 text-sm text-gray-400">
                  Hey, can tell me about progress of project? I'm waiting for
                  your response.
                </p>
                <p className="text-right text-sm text-gray-400">Dec, 12</p>
              </div>
            </div>
            <div className="flex w-full border-t border-gray-700 p-4 hover:bg-gray-700 2xl:items-start">
              <img
                src="https://images.unsplash.com/photo-1543965170-4c01a586684e?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDZ8fG1hbnxlbnwwfDB8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
                alt="profile image"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="w-full pl-4">
                <div className="flex w-full items-center justify-between">
                  <div className="font-medium text-white">David</div>
                  <div className="flex h-7 w-7 cursor-pointer items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>
                <p className="my-2 text-sm text-gray-400">
                  Hey, can tell me about progress of project? I'm waiting for
                  your response.
                </p>
                <p className="text-right text-sm text-gray-400">Dec, 12</p>
              </div>
            </div>
            <div className="flex w-full border-t border-gray-700 p-4 hover:bg-gray-700 2xl:items-start">
              <img
                src="https://images.unsplash.com/photo-1533993192821-2cce3a8267d1?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTl8fHdvbWFuJTIwbW9kZXJufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
                alt="profile image3"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="w-full pl-4">
                <div className="flex w-full items-center justify-between">
                  <div className="font-medium text-white">Mark</div>
                  <div className="flex h-7 w-7 cursor-pointer items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>
                <p className="my-2 text-sm text-gray-400">
                  I am really impressed! Can't wait to see the final result.
                </p>
                <p className="text-right text-sm text-gray-400">Dec, 12</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}