import React, { useState, useRef, useEffect } from 'react';
import { User } from '../../types';
import { uploadDocumentToDify } from '../../services/geminiService';


// Icons
const DocumentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);
const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const ExclamationTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);


const mockDocuments = [
    { name: 'Kurikulum Merdeka.pdf', size: '2.5 MB', uploaded: '2024-05-20' },
    { name: 'Panduan Penilaian Siswa.docx', size: '780 KB', uploaded: '2024-05-18' },
    { name: 'Jadwal Pelajaran 2024.xlsx', size: '1.2 MB', uploaded: '2024-05-15' },
    { name: 'Buku Ajar Kelas 10.pdf', size: '15.8 MB', uploaded: '2024-05-12' },
];

interface KnowledgeBaseTabProps {
    user: User;
}

const KnowledgeBaseTab: React.FC<KnowledgeBaseTabProps> = ({ user }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => {
                setFeedback(null);
            }, 5000); // Clear feedback after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [feedback]);
    
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setFeedback(null);

        try {
            // Fix: Property 'username' does not exist on type 'User'. Changed to 'nip' which is used as the unique user identifier.
            const response = await uploadDocumentToDify(file, user.nip);
            setFeedback({ type: 'success', message: `Successfully uploaded "${response.name}"!` });
            // In a real app, you would refetch the documents list here to update the table
        } catch (error: any) {
            setFeedback({ type: 'error', message: error.message || 'File upload failed. Please try again.' });
        } finally {
            setIsUploading(false);
            // Reset file input to allow re-uploading the same file
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.docx,.txt,.md,.json"
            disabled={isUploading}
        />
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="font-semibold text-lg">Knowledge Base Documents</h3>
                <p className="text-sm text-slate-500">Manage the files AISA uses to answer questions.</p>
            </div>
            <button
                onClick={triggerFileInput}
                disabled={isUploading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-slate-400 disabled:cursor-wait"
            >
                {isUploading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                    </>
                ) : (
                    <>
                        <UploadIcon className="w-5 h-5"/>
                        Upload New Document
                    </>
                )}
            </button>
        </div>

        {feedback && (
            <div className={`p-4 mb-4 rounded-md text-sm flex items-center gap-3 ${
                feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
            }`}>
                {feedback.type === 'success' ? <CheckCircleIcon className="w-5 h-5"/> : <ExclamationTriangleIcon className="w-5 h-5"/>}
                {feedback.message}
            </div>
        )}

        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Size</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Uploaded</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {mockDocuments.map((doc) => (
                        <tr key={doc.name}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 flex items-center gap-3">
                                <DocumentIcon className="w-5 h-5 text-slate-400" />
                                {doc.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{doc.size}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{doc.uploaded}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button className="text-emerald-600 hover:text-emerald-900">View</button>
                                <button onClick={() => alert(`Deleting ${doc.name}...`)} className="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default KnowledgeBaseTab;