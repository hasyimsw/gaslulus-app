async function runTest() {
  console.log('--- TESTING LOGIN ---');
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@gaslulus.id', password: 'user123' })
  });
  const loginData = await loginRes.json();
  console.log('Login Response:', loginData);
  
  if (!loginData.success) return;
  const token = loginData.data.token;

  console.log('\n--- TESTING UPDATE PROFILE ---');
  const profileRes = await fetch('http://localhost:5000/api/users/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ name: 'Budi Test' })
  });
  
  const textProfile = await profileRes.text();
  console.log('Profile HTTP Status:', profileRes.status);
  console.log('Profile Response:', textProfile);
  
  console.log('\n--- TESTING RESULT DETAIL ---');
  const resultRes = await fetch('http://localhost:5000/api/results/5', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const textResult = await resultRes.text();
  console.log('Result HTTP Status:', resultRes.status);
  console.log('Result Response:', textResult);
}

runTest();
