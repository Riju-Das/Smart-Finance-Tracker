import csv from 'csv-parser';
import { Readable } from 'stream';

export interface ParsedTransaction{
  date:string;
  description:string;
  amount:number;
  type: 'INCOME' | 'EXPENSE';
}

export async function parseCSV(fileBuffer: Buffer): Promise<ParsedTransaction[]>{
  const results:ParsedTransaction[] = [];

  return new Promise((resolve,reject)=>{
    const stream = Readable.from(fileBuffer);
    stream
      .pipe(csv())
      .on('data', (row)=>{
        const transaction = parseRow(row);
        if (transaction) results.push(transaction);
      })
      .on('end', ()=>resolve(results))
      .on('error', (err)=>reject(err));
  });
}

function parseRow(row:any): ParsedTransaction | null {
  try{
    const date = row['Date'] || row['date'] || row['Transaction Date'];
    if(!date) return null;

    const description = row['Description'] || row['description'] || row['Memo'];
    if(!description) return null;

    const result = parseAmount(row);
    if(!result) return null;

    return {
      date: new Date(date).toISOString(),
      description: description.trim(),
      amount: result.amount,
      type:result.type
    };

  }
  catch(err){
    return null;
  }
}

function parseAmount(row:any): {amount:number ; type: 'INCOME' | 'EXPENSE';} | null{

  const debit = parseFloat(row['Debit'] || row['debit'] || 0);
  const credit = parseFloat(row['Credit'] || row['credit'] || 0);
  if(debit>0) return {amount: debit, type:'EXPENSE'};
  if(credit>0) return {amount:credit, type:'INCOME'};

  const amount = parseFloat(row['Amount'] || row['amount'] || 0);
  if(amount!==0){
    return {
      amount: Math.abs(amount),
      type: amount>0?'INCOME':'EXPENSE'
    };
  }
  return null;
}