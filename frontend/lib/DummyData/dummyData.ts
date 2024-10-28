interface FileData {
  filename: string;
  uploader: string;
  uploadedTime: Date;
  downloads: number;
  fileLocation: string;
}

export const dummyFiles: FileData[] = [
  {
    filename: 'project_report.pdf',
    uploader: 'John Smith',
    uploadedTime: new Date('2024-03-15T10:30:00'),
    downloads: 156,
    fileLocation: 'files/1.txt',
  },
  {
    filename: 'presentation_v2.pptx',
    uploader: 'Sarah Johnson',
    uploadedTime: new Date('2024-03-14T15:45:00'),
    downloads: 89,
    fileLocation: 'files/2.txt',
  },
  {
    filename: 'data_analysis.xlsx',
    uploader: 'Mike Brown',
    uploadedTime: new Date('2024-03-13T09:20:00'),
    downloads: 234,
    fileLocation: 'files/3.txt',
  },
  {
    filename: 'user_manual.docx',
    uploader: 'Emily Davis',
    uploadedTime: new Date('2024-03-12T14:15:00'),
    downloads: 67,
    fileLocation: 'files/4.txt',
  },
  {
    filename: 'source_code.zip',
    uploader: 'Alex Wilson',
    uploadedTime: new Date('2024-03-11T11:00:00'),
    downloads: 445,
    fileLocation: 'files/5.txt',
  },
  {
    filename: 'marketing_plan_2024.pdf',
    uploader: 'Lisa Chen',
    uploadedTime: new Date('2024-03-10T16:20:00'),
    downloads: 178,
    fileLocation: 'files/6.txt',
  },
  {
    filename: 'budget_forecast.xlsx',
    uploader: 'Robert Taylor',
    uploadedTime: new Date('2024-03-09T13:45:00'),
    downloads: 92,
    fileLocation: 'files/7.txt',
  },
  {
    filename: 'product_photos.zip',
    uploader: 'Maria Garcia',
    uploadedTime: new Date('2024-03-08T09:15:00'),
    downloads: 567,
    fileLocation: 'files/8.txt',
  },
  {
    filename: 'client_meeting_notes.docx',
    uploader: 'David Kim',
    uploadedTime: new Date('2024-03-07T11:30:00'),
    downloads: 45,
    fileLocation: 'files/9.txt',
  },
  {
    filename: 'company_logo.ai',
    uploader: 'Sophie Martin',
    uploadedTime: new Date('2024-03-06T14:20:00'),
    downloads: 89,
    fileLocation: 'files/10.txt',
  },
  {
    filename: 'annual_report_2023.pdf',
    uploader: 'James Wilson',
    uploadedTime: new Date('2024-03-05T10:00:00'),
    downloads: 892,
    fileLocation: 'files/11.txt',
  },
  {
    filename: 'training_video.mp4',
    uploader: 'Anna Thompson',
    uploadedTime: new Date('2024-03-04T15:30:00'),
    downloads: 334,
    fileLocation: 'files/12.txt',
  },
  {
    filename: 'api_documentation.md',
    uploader: 'Chris Anderson',
    uploadedTime: new Date('2024-03-03T12:45:00'),
    downloads: 445,
    fileLocation: 'files/13.txt',
  },
  {
    filename: 'sales_data_q1.csv',
    uploader: 'Patricia Lopez',
    uploadedTime: new Date('2024-03-02T09:15:00'),
    downloads: 167,
    fileLocation: 'files/14.txt',
  },
  {
    filename: 'website_mockup.fig',
    uploader: 'Tom Jackson',
    uploadedTime: new Date('2024-03-01T16:00:00'),
    downloads: 78,
    fileLocation: 'files/15.txt',
  },
];
