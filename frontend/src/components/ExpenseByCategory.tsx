
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6F91'];

const data = [
  { name: 'Groceries', value: 8000 },
  { name: 'Rent', value: 48000 },
  { name: 'Utilities', value: 3000 },
  { name: 'Transport', value: 1500 },
  { name: 'Entertainment', value: 2000 },
];

function ExpenseByCategory() {



  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill='#FF6F91' />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </>
  )
}

export default ExpenseByCategory