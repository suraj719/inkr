import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const dummyUsers = [
  { id: 'user1', name: 'John Doe' },
  { id: 'user2', name: 'Jane Smith' },
  { id: 'user3', name: 'Mike Johnson' },
];

export default function ParticipantIcon() {
  const [activeSpeaker, setActiveSpeaker] = useState(null);

  useEffect(() => {
    // Simulate changing active speaker every 3-4 seconds
    const interval = setInterval(() => {
      const randomUser = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
      setActiveSpeaker(randomUser);
    }, Math.random() * 1000 + 3000); // Random time between 3-4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      position: 'absolute', 
      top: 80,
      right: 20, 
      display: 'flex', 
      gap: '10px',
      padding: '10px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      marginRight: '20px'
    }}>
      {dummyUsers.map((user) => (
        <motion.div
          key={user.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: activeSpeaker?.id === user.id ? 1.1 : 1,
            opacity: 1
          }}
          transition={{ duration: 0.3 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            position: 'relative'
          }}
        >
          <motion.div
            animate={{
              scale: activeSpeaker?.id === user.id ? [1, 1.1, 1] : 1,
              boxShadow: activeSpeaker?.id === user.id 
                ? ['0 0 0 0 rgba(84, 180, 53, 0.4)', '0 0 0 10px rgba(84, 180, 53, 0)', '0 0 0 0 rgba(84, 180, 53, 0)']
                : 'none'
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: activeSpeaker?.id === user.id ? '3px solid #54b435' : '3px solid transparent',
              transition: 'all 0.3s ease',
              background: activeSpeaker?.id === user.id ? 'linear-gradient(45deg, #ffffff, #e8f5e9)' : 'none'
            }}
          >
            <img
              src={`https://avatar.vercel.sh/${user.id}.png`}
              alt={user.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                filter: activeSpeaker?.id === user.id ? 'brightness(1.1)' : 'none'
              }}
            />
          </motion.div>
          <motion.span 
            animate={{
              y: activeSpeaker?.id === user.id ? [0, -2, 0] : 0,
              color: activeSpeaker?.id === user.id ? '#54b435' : '#373737'
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ 
              fontSize: '12px', 
              fontFamily: 'secondaryFont',
              fontWeight: activeSpeaker?.id === user.id ? '600' : '400',
              opacity: activeSpeaker?.id === user.id ? 1 : 0.7
            }}
          >
            {user.name}
          </motion.span>
          {activeSpeaker?.id === user.id && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#54b435',
                border: '2px solid white'
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
} 