import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Select, MenuItem, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import AddButton from '../components/addbutton';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import invoiceData from '../../src/data/invoicedata.json'
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import axios from 'axios';

// Invoice türünü tanımlıyoruz
interface Invoice {
  invoice_id: string;
  user_id?: string;
  invoice_title: string;
  date: string;
  amount: number;
  currency: string;
  items: {
    description: string;
    quantity: number;
    price: number;
  }[];
  status: string;
  id?: number; // Bazı kayıtlar için opsiyonel
}

const STATUS_COLORS: Record<Invoice['status'], string> = {
  Paid: '#4CAF50',
  Pending: '#FF9800',
  Overdue: '#F44336'
};

const ReportPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useDarkMode();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid' | 'overdue'>('all');
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Arama ve filtreleme
  const filteredInvoices = invoiceData.filter((invoice: Invoice) =>
    (filter === 'all' || invoice.status === filter) &&
    invoice.invoice_title.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    if (userId) {
      axios.get<Invoice[]>('/invoicedata.json')
        .then((response) => {
          setInvoices(response.data.filter(invoice => invoice.user_id === userId));
        })
        .catch((error) => {
          console.error("Error fetching invoice data:", error);
        });
    }
  }, [userId]);

  // Özet verileri
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((i: Invoice) => i.status === 'paid').length;
  const unpaidInvoices = invoices.filter((i: Invoice) => i.status === 'unpaid' ).length;
  const overdueInvoices = invoices.filter((i: Invoice) => i.status === 'overdue' ).length;

  // Aylık fatura sayıları
  const monthlyInvoices = invoiceData.reduce(
    (acc: Record<string, number>, invoice: Invoice) => {
      if (invoice.user_id === userId) { // user_id eşleşmesi kontrolü
        const month = new Date(invoice.date).toLocaleString("default", { month: "short" });
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    },
    {}
  );

  const monthlyChartData = Object.entries(monthlyInvoices).map(([month, count]) => ({ month, count }));

  // Fatura durumları için pasta grafiği
  const pieChartData = [
    { name: 'Paid', value: paidInvoices, color: STATUS_COLORS.Paid },
    { name: 'Pending', value: unpaidInvoices, color: STATUS_COLORS.Pending },
    { name: 'Overdue', value: overdueInvoices, color: STATUS_COLORS.Overdue }
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: darkMode ? '#444' : '#e0e0e0', overflow: 'hidden' }}>

      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <Box sx={{ flexGrow: 1, padding: 3, marginLeft: sidebarOpen ? { xs: 0, sm: '200px' } : { xs: 0, sm: '60px' }, overflowY: 'auto', position: 'relative' }}>

        <Topbar sidebarOpen={sidebarOpen} darkMode={darkMode} />
        {/*main content*/}
        <Box sx={{ marginTop: "100px" }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {[['Total Invoices', totalInvoices], ['Paid', paidInvoices], ['Pending', unpaidInvoices], ['Overdue', overdueInvoices]].map(([label, value], index) => (
              <Card key={index} sx={{ flex: 1, backgroundColor: darkMode ? '#555' : '#fff', color: darkMode ? '#fff' : '#000' }}>
                <CardContent>
                  <Typography variant="h6">{label}</Typography>
                  <Typography variant="h4">{value}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Filtreleme ve Arama */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button variant="contained" color="primary">Export PDF</Button>
            <Button variant="contained" color="secondary">Export Excel</Button>
          </Box>

          {/* Grafikler */}
          <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
            <Card sx={{ flex: 1, p: 2, backgroundColor: darkMode ? '#555' : '#fff' }}>
              <Typography variant="h6" gutterBottom>Monthly Invoice Trend</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyChartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2196F3" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card sx={{ flex: 1, p: 2, backgroundColor: darkMode ? '#555' : '#fff' }}>
              <Typography variant="h6" gutterBottom>Invoice Status Distribution</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieChartData} dataKey="value" nameKey="name" outerRadius={80}>
                    {pieChartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Box>
        </Box>
        <AddButton darkMode={darkMode} />
      </Box>
    </Box>
  );
};

export default ReportPage;
