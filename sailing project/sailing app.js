import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({ name: '', date: '', destination: '' });
 const userId='user1';
  useEffect(()=>{
    fetchTrips();
  },[userId]);
  const fetchTrips=async()=>{
    try{
      const response=await fetch(`http://localhost:5000/api/trips/${userId}`);
      const data=await response.json();
      setTrips(data);
    }catch(error){
      console.error('Error fetching trips:',error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTrip({ ...newTrip, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/trips/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTrip),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
    } catch (error) {
      console.error('Error adding trip:', error);
    
    }
      ;
      setTrips([...trips, data]);
    setNewTrip({ name: '', date: '', destination: '' });
 
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Sailing Trip Planner</title>
        <meta name="description" content="Plan your sailing trips" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Sailing Trip Planner</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="name"
            value={newTrip.name}
            onChange={handleInputChange}
            placeholder="Trip Name"
            required
          />
          <input
            type="date"
            name="date"
            value={newTrip.date}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="destination"
            value={newTrip.destination}
            onChange={handleInputChange}
            placeholder="Destination"
            required
          />
          <button type="submit">Add Trip</button>
        </form>

        <div className={styles.tripList}>
          <h2>Your Trips</h2>
          {trips.map((trip, index) => (
            <div key={index} className={styles.trip}>
              <h3>{trip.name}</h3>
              <p>Date: {trip.date}</p>
              <p>Destination: {trip.destination}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
