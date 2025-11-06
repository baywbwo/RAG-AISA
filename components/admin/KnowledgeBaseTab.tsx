import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User } from '../../types';
import { uploadDocumentToDify, getDocumentsFromDify, deleteDocumentFromDify } from '../../services/geminiService';


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

interface Document {
    id: string;
    name: string;
    size: string;
    uploaded: string;
}

interface KnowledgeBaseTabProps {
    user: User;
}

const KnowledgeBaseTab: React.FC<KnowledgeBaseTabProps> = ({ user }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoadingList, setIsLoadingList] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [docToDelete, setDocToDelete] = useState<Document | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const fetchDocuments = useCallback(async () => {
        setIsLoadingList(true);
        try {
            const difyDocs = await getDocumentsFromDify();
            const formattedDocs = difyDocs.map((doc: any) => ({
                id: doc.id,
                name: doc.name,
                size: formatFileSize(doc.size),
                uploaded: new Date(doc.created_at * 1000).toLocaleDateString('en-CA'),
            }));
            setDocuments(formattedDocs);
        } catch (error: any) {
            setFeedback({ type: 'error', message: `Failed to load documents: ${error.message}` });
        } finally {
            setIsLoadingList(false);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => setFeedback(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);
    
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setFeedback(null);

        try {
            const response = await uploadDocumentToDify(file, user.nip);
            setFeedback({ type: 'success', message: `Successfully uploaded "${response.name}"!` });
            await fetchDocuments(); // Refresh the list after upload
        } catch (error: any) {
            setFeedback({ type: 'error', message: error.message || 'File upload failed. Please try again.' });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
    
    const handleDeleteConfirm = async () => {
        if (!docToDelete) return;
        
        try {
            await deleteDocumentFromDify(docToDelete.id);
            setFeedback({ type: 'success', message: `Successfully deleted "${docToDelete.name}".` });
            setDocToDelete(null);
            await fetchDocuments(); // Refresh the list after deletion
        } catch (error: any) {
            setFeedback({ type: 'error', message: error.message || 'File deletion failed.' });
            setDocToDelete(null);
        }
    };

    const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <>
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.docx,.txt,.md,.json,.html,.csv"
            disabled={isUploading}
        />
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="font-semibold text-lg">Knowledge Base Documents</h3>
                <p className="text-sm text-slate-500">Manage the files AISA uses to answer questions.</p>
            </div>
            <button
                onClick={triggerFileInput}
                disabled={isUploading || isLoadingList}
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
                    {isLoadingList ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-5 h-5 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin"></div>
                                  <span>Loading documents from Dify...</span>
                                </div>
                            </td>
                        </tr>
                    ) : documents.length > 0 ? (
                        documents.map((doc) => (
                            <tr key={doc.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 flex items-center gap-3">
                                    <DocumentIcon className="w-5 h-5 text-slate-400" />
                                    {doc.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{doc.size}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{doc.uploaded}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button className="text-emerald-600 hover:text-emerald-900 disabled:text-slate-300" disabled>View</button>
                                    <button onClick={() => setDocToDelete(doc)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">
                                No documents have been uploaded to the knowledge base yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>

    {/* Delete Confirmation Modal */}
    {docToDelete && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" aria-modal="true">
             <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
                <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-slate-900">Delete Document</h3>
                        <div className="mt-2">
                            <p className="text-sm text-slate-500">
                                Are you sure you want to delete <strong>{docToDelete.name}</strong>? This will permanently remove it from the knowledge base.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:w-auto sm:text-sm"
                        onClick={handleDeleteConfirm}
                    >
                        Confirm Delete
                    </button>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setDocToDelete(null)}
                    >
                        Cancel
                    </button>
                </div>
             </div>
         </div>
    )}
    </>
  );
};

export default KnowledgeBaseTab;