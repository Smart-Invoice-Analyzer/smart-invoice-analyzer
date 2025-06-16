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
import { useExchangeRates } from '../hooks/useExchangeRates';
import { Invoice } from '../types';

interface InvoicesResponse {
  invoices: Invoice[];
}


const ReportPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useDarkMode();
  const [search, setSearch] = useState('');
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
  const baseColors = [
    '#4CAF50', '#FF9800', '#F44336', '#2196F3', '#9C27B0',
    '#00BCD4', '#E91E63', '#8BC34A', '#FFC107', '#795548',
    '#673AB7', '#CDDC39', '#3F51B5', '#FF5722', '#607D8B',
    '#1E88E5', '#D32F2F', '#43A047', '#FDD835', '#5E35B1'
  ];

  const darkModeColors = [
    '#81C784', '#FFB74D', '#EF9A9A', '#64B5F6', '#BA68C8',
    '#4DD0E1', '#F48FB1', '#AED581', '#FFD54F', '#A1887F',
    '#9575CD', '#DCE775', '#7986CB', '#FF8A65', '#90A4AE',
    '#64B5F6', '#E57373', '#66BB6A', '#FFF176', '#7E57C2'
  ];

  function getColor(index: number, darkMode: boolean) {
    const colors = darkMode ? darkModeColors : baseColors;
    return colors[index % colors.length];
  }

  const rates = useExchangeRates('USD');

  const convertedInvoices = invoices.map((invoice) => {
    const rate = rates[invoice.currency] || 1;
    return {
      ...invoice,
      converted_total: invoice.total_amount / rate,
    };
  });
  // En büyük 5 tedarikçi
  const topVendors = convertedInvoices.reduce((acc: Record<string, number>, invoice: Invoice & { converted_total: number }) => {
    const vendorName = invoice.vendor.name;
    acc[vendorName] = (acc[vendorName] || 0) + invoice.converted_total;
    return acc;
  }, {});


  const topVendorsData = Object.entries(topVendors)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([vendor, amount]) => ({ vendor, amount }));

  // En pahalı 5 ürün kategorisi
  const categoryPrices = convertedInvoices.reduce((acc: Record<string, number[]>, invoice: Invoice) => {
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

  const invoiceCountPerVendor = invoices.reduce((acc: Record<string, number>, invoice: Invoice) => {
    const vendorName = invoice.vendor.name;
    acc[vendorName] = (acc[vendorName] || 0) + 1;
    return acc;
  }, {});

  const invoiceCountPerVendorData = Object.entries(invoiceCountPerVendor)
    .sort(([, a], [, b]) => b - a)
    .map(([vendor, count]) => ({ vendor, count }))
    .slice(0, 5);




  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: darkMode ? '#444' : '#e0e0e0', overflow: 'hidden' }}>

      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <Box sx={{ flexGrow: 1, padding: 3, marginLeft: sidebarOpen ? { xs: 0, sm: '200px' } : { xs: 0, sm: '60px' }, overflowY: 'auto', position: 'relative' }}>

        <Topbar sidebarOpen={sidebarOpen} darkMode={darkMode} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        {/*main content*/}
        <Box sx={{ marginTop: "100px" }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4, justifyContent: 'center' }}>
            {[['Total Invoices', totalInvoices], ['Total Amount (USD)', convertedInvoices.reduce((sum, inv) => sum + inv.converted_total, 0).toFixed(2)]].map(([label, value], index) => (
              <Card key={index} sx={{ flex: '1 1 calc(25% - 24px)', p: 2, minWidth: '250px', backgroundColor: darkMode ? '#2C2C2C' : '#fff', color: darkMode ? '#fff' : '#000', boxShadow: 3, borderRadius: 4 }}>
                <CardContent>
                  <Typography variant="h6">{label}</Typography>
                  <Typography variant="h4">{value}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Grafikler */}
         {/* Grafikler */}
<Box
  sx={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 3,
    mb: 4,
    flexDirection: { xs: 'column', md: 'row' },
  }}
>
  {[
    {
      title: 'Monthly Invoice Trend',
      data: monthlyChartData,
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyChartData}>
            <XAxis dataKey="month" tick={{ fill: darkMode ? '#ccc' : '#333' }} />
            <YAxis tick={{ fill: darkMode ? '#ccc' : '#333' }} />
            <Tooltip />
            <Bar dataKey="count" fill={darkMode ? '#81C784' : '#4CAF50'} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: 'Invoices by Product Category',
      data: byCategoryChartData,
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={byCategoryChartData}>
            <XAxis dataKey="category" tick={{ fill: darkMode ? '#ccc' : '#333' }} />
            <YAxis tick={{ fill: darkMode ? '#ccc' : '#333' }} />
            <Tooltip />
            <Bar dataKey="count" fill={darkMode ? '#64B5F6' : '#2196F3'} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: 'Top 5 Vendors by Total Amount (USD)',
      data: topVendorsData,
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topVendorsData}>
            <XAxis dataKey="vendor" tick={{ fill: darkMode ? '#ccc' : '#333' }} />
            <YAxis tick={{ fill: darkMode ? '#ccc' : '#333' }} />
            <Tooltip />
            <Bar dataKey="amount" fill={darkMode ? '#CE93D8' : '#9C27B0'} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: 'Top 5 Vendors by Amount of Invoice',
      data: invoiceCountPerVendorData,
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={invoiceCountPerVendorData}>
            <XAxis dataKey="vendor" tick={{ fill: darkMode ? '#ccc' : '#333' }} />
            <YAxis tick={{ fill: darkMode ? '#ccc' : '#333' }} />
            <Tooltip />
            <Bar dataKey="count" fill={darkMode ? '#FDD835' : '#cbb94a'} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: 'Top 5 Expensive Categories',
      data: topCategoriesData,
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topCategoriesData}>
            <XAxis dataKey="category" tick={{ fill: darkMode ? '#ccc' : '#333' }} />
            <YAxis tick={{ fill: darkMode ? '#ccc' : '#333' }} />
            <Tooltip />
            <Bar dataKey="avgPrice" fill={darkMode ? '#EF9A9A' : '#D32F2F'} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: 'Currency Distribution',
      data: currencyData,
      chart: (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={currencyData} dataKey="value" nameKey="name" outerRadius={80}>
              {currencyData.map((entry, index) => (
                <Cell key={index} fill={getColor(index, darkMode)} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ),
    },
  ].map((chartData, index) => (
    <Card
      key={index}
      sx={{
        flex: '1 1 calc(25% - 24px)',
        p: 2,
        backgroundColor: darkMode ? '#2C2C2C' : '#fff',
        color: darkMode ? '#fff' : '#000',
        boxShadow: 3,
        borderRadius: 4,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {chartData.title}
      </Typography>
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
