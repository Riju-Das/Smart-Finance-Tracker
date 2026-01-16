import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from 'sonner';
import axios from "axios";

interface ImportCSVProps {
  onImportSuccess: () => void;
}

function ImportCSV({ onImportSuccess }: ImportCSVProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast.error("Please select a valid CSV file");
        return;
      }
      setCsvFile(file);
    }
  };

  const handleCSVImport = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', csvFile);

      const res = await api.post("/transactions/import-csv", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(res.data.message || "Transactions imported successfully");
      onImportSuccess();
      setCsvFile(null);
      setDialogOpen(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.message || "Failed to import CSV");
      }
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <button className="md:px-5 py-2 px-5 flex items-center justify-center  rounded-lg relative bg-gray-950 cursor-pointer text-white md:text-sm text-xs hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600 text-center">
          <span className='text-xs text-center flex justify-center items-center'>
            <svg fill="#ffffff" width="20" height="20" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg" data-iconid="export" data-svgname="Export">
              <path d="M8.71,7.71,11,5.41V15a1,1,0,0,0,2,0V5.41l2.29,2.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42l-4-4a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-4,4A1,1,0,1,0,8.71,7.71ZM21,14a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V15a1,1,0,0,0-2,0v4a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V15A1,1,0,0,0,21,14Z" />
            </svg>
            &nbsp;
          </span>  Import 
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-black border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Import Transactions from CSV</DialogTitle>
        </DialogHeader>

        <div className="my-5 space-y-5">
          <div className="space-y-3">
            <Label htmlFor="csv-file" className="text-sm font-medium">
              Select CSV File
            </Label>
            <div className="flex flex-col gap-3">
              <input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-950 file:text-white hover:file:bg-gray-900 file:cursor-pointer cursor-pointer border border-white/10 rounded-lg bg-gray-950/50"
              />
              {csvFile && (
                <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-950/50 p-2 rounded-md border border-white/10">

                  <span className="truncate">{csvFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setCsvFile(null)}
                    className="ml-auto text-gray-400 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setDialogOpen(false);
                setCsvFile(null);
              }}
              className="flex-1 px-4 py-2 rounded-md bg-gray-950 text-white border border-white/10 hover:bg-gray-900 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCSVImport}
              disabled={!csvFile || isImporting}
              className="flex-1 px-4 py-2 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? "Importing..." : "Import"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImportCSV;
