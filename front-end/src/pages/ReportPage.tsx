import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Select, MenuItem, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import AddButton from '../components/addbutton';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import axios from 'axios';
import { api_url } from '../api/apiconfig';

interface Vendor {
  name: string;
  address: string;
  country: string;
  phone: string;
  email: string;
}

interface Item {
  description: string;
  quantity: number;
  unit_price: number;
  category: string;
}

interface Invoice {
  id: number;
  invoice_number: string;
  date: string;  // YYYY-MM-DD formatında tarih
  total_amount: number;
  currency: string;
  qr_data: string;
  vendor: Vendor;
  items: Item[];
  status: string;
}
interface InvoicesResponse {
  invoices: Invoice[];
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
  const userId = useSelector((state: RootState) => state.auth.user_id);
  const username = useSelector((state: RootState) => state.auth.userName)
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filters, setFilters] = useState({ Paid: false, Unpaid: false });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);


  // Arama ve filtreleme
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.vendor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      (!filters.Paid && !filters.Unpaid) || // Hiçbir checkbox seçili değilse hepsini göster
      (filters.Paid && invoice.status === 'paid') ||
      (filters.Unpaid && invoice.status === 'unpaid');
    return matchesSearch && matchesFilter;
  });
  React.useEffect(() => {
    setLoading(true);
    axios.get<InvoicesResponse>(`${api_url}/invoices/get_invoices`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        console.log(response.data, 'repsinse')
        if (Array.isArray(response.data.invoices)) {
          setInvoices(response.data.invoices);
        } else {
          console.error("Received data is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching invoice data:", error);
      });
  }, [username]);
  // Özet verileri
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((i: Invoice) => i.status === 'paid').length || 7;
  const unpaidInvoices = invoices.filter((i: Invoice) => i.status === 'unpaid').length|| 3;
  const overdueInvoices = invoices.filter((i: Invoice) => i.status === 'overdue').length|| 3;
  const colors = [
    '#4CAF50', '#FF9800', '#F44336', '#2196F3', '#9C27B0',
    '#00BCD4', '#E91E63', '#8BC34A', '#FFC107', '#795548',
    '#673AB7', '#CDDC39', '#3F51B5', '#FF5722', '#607D8B',
    '#1E88E5', '#D32F2F', '#43A047', '#FDD835', '#5E35B1'
  ];


  // En büyük 5 tedarikçi
  const topVendors = invoices.reduce((acc: Record<string, number>, invoice: Invoice) => {
    const vendorName = invoice.vendor.name;
    acc[vendorName] = (acc[vendorName] || 0) + invoice.total_amount;
    return acc;
  }, {});
  const topVendorsData = Object.entries(topVendors)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([vendor, amount]) => ({ vendor, amount }));

  // En pahalı 5 ürün kategorisi
  const categoryPrices = invoices.reduce((acc: Record<string, number[]>, invoice: Invoice) => {
    invoice.items.forEach(item => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item.unit_price);
    });
    return acc;
  }, {});

  const topCategoriesData = Object.entries(categoryPrices)
    .map(([category, prices]) => ({ category, avgPrice: prices.reduce((sum, p) => sum + p, 0) / prices.length }))
    .sort((a, b) => b.avgPrice - a.avgPrice)
    .slice(0, 5);

  // Para birimi dağılımı
  const currencyDistribution = invoices.reduce((acc: Record<string, number>, invoice: Invoice) => {
    acc[invoice.currency] = (acc[invoice.currency] || 0) + 1;
    return acc;
  }, {});

  const currencyData = Object.entries(currencyDistribution).map(([currency, count]) => ({ name: currency, value: count }));

  // Aylık fatura sayıları
  const monthlyInvoices = invoices.reduce(
    (acc: Record<string, number>, invoice: Invoice) => {

      const month = new Date(invoice.date).toLocaleString("default", { month: "short" });
      acc[month] = (acc[month] || 0) + 1;

      return acc;
    },
    {}
  );

  const InvoicesCategory = invoices.reduce(
    (acc: Record<string, number>, invoice: Invoice) => {

      const category = invoice.items[0].category
      acc[category] = (acc[category] || 0) + 1;

      return acc;
    },
    {}
  );

  const monthlyChartData = Object.entries(monthlyInvoices).map(([month, count]) => ({ month, count }));
  const byCategoryChartData = Object.entries(InvoicesCategory).map(([category, count]) => ({ category, count }));

  // Fatura durumları için pasta grafiği
  const pieChartData = [
    { name: 'Paid', value: paidInvoices || 7, color: STATUS_COLORS.Paid },
    { name: 'Pending', value: unpaidInvoices || 3, color: STATUS_COLORS.Pending },
    { name: 'Overdue', value: overdueInvoices || 3, color: STATUS_COLORS.Overdue }
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: darkMode ? '#444' : '#e0e0e0', overflow: 'hidden' }}>

      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <Box sx={{ flexGrow: 1, padding: 3, marginLeft: sidebarOpen ? { xs: 0, sm: '200px' } : { xs: 0, sm: '60px' }, overflowY: 'auto', position: 'relative' }}>

        <Topbar sidebarOpen={sidebarOpen} darkMode={darkMode} />
    {/*main content*/}
<Box sx={{ marginTop: "100px" }}>
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4, justifyContent: 'center' }}>
    {[['Total Invoices', totalInvoices], ['Paid', paidInvoices], ['Pending', unpaidInvoices], ['Overdue', overdueInvoices]].map(([label, value], index) => (
      <Card key={index} sx={{ flex: '1 1 calc(25% - 24px)', p: 2, minWidth: '250px', backgroundColor: darkMode ? '#555' : '#fff', color: darkMode ? '#fff' : '#000' }}>
        <CardContent>
          <Typography variant="h6">{label}</Typography>
          <Typography variant="h4">{value}</Typography>
        </CardContent>
      </Card>
    ))}
  </Box>

  {/* Grafikler */}  
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
    {[{
      title: <span style={{color:darkMode ? '#fff' : '#000'}}>Monthly Invoice Trend</span>,
      data: monthlyChartData,
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyChartData}>
            <XAxis dataKey="month"  />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      ),
    }, {
      title: <span style={{color:darkMode ? '#fff' : '#000'}}>Invoices by Product Category</span>,
      data: byCategoryChartData,
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={byCategoryChartData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2196F3" />
          </BarChart>
        </ResponsiveContainer>
      ),
    }, {
      title: <span style={{color:darkMode ? '#fff' : '#000'}}>Top 5 Vendors by Total Amount </span>,
      data: topVendorsData,
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topVendorsData}>
            <XAxis dataKey="vendor" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#9C27B0" />
          </BarChart>
        </ResponsiveContainer>
      ),
    }, {
      title: <span style={{color:darkMode ? '#fff' : '#000'}}>Top 5 Expensive Categories</span>,
      data: topCategoriesData,
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topCategoriesData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avgPrice" fill="#FF9800" />
          </BarChart>
        </ResponsiveContainer>
      ),
    }, {
      title: <span style={{color:darkMode ? '#fff' : '#000'}}>Currency Distribution</span>,
      data: currencyData,
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={currencyData} dataKey="value" nameKey="name" outerRadius={80}>
              {currencyData.map((entry, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ),
    }, {
      title: <span style={{color:darkMode ? '#fff' : '#000'}}>Invoice Status Distribution</span>,
      data: pieChartData,
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieChartData} dataKey="value" nameKey="name" outerRadius={80}>
              {pieChartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
            </Pie>
            <Tooltip />
            <Legend/>
          </PieChart>
        </ResponsiveContainer>
      ),
    }].map((chartData, index) => (
      <Card key={index} sx={{ flex: '1 1 calc(25% - 24px)', p: 2, backgroundColor: darkMode ? '#555' : '#fff' }}>
        <Typography variant="h6" gutterBottom>{chartData.title}</Typography>
        {chartData.chart}
      </Card>
    ))}
  </Box>
</Box>
        <AddButton darkMode={darkMode} />
      </Box>
    </Box>
  );
};

export default ReportPage;
