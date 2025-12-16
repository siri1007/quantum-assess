// import React, { useState } from 'react';
// import './MainChatDashboard.css';

// const dummyGroups = [
//   { id: 1, name: 'Designers Group' },
//   { id: 2, name: 'Dev Team' },
//   { id: 3, name: 'Marketing Team' }
// ];

// const dummyUsers = [
//   { id: 1, name: 'Alice' },
//   { id: 2, name: 'Bob' },
//   { id: 3, name: 'Charlie' },
//   { id: 4, name: 'Eve' },
//   { id: 5, name: 'Mallory' },
//   { id: 6, name: 'Trent' },
//   { id: 7, name: 'Oscar' }
// ];

// export default function MainChatDashboard() {
//   const [viewUsers, setViewUsers] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(dummyGroups[0]);
//   const [selectedGroup, setSelectedGroup] = useState(dummyGroups[0]);
//   const [searchText, setSearchText] = useState('');
//   const [messageText, setMessageText] = useState('');
//   const [newGroupName, setNewGroupName] = useState('');

//   const [chatHistory, setChatHistory] = useState({
//     groups: {
//       1: [{ sender: 'Alice', text: 'Welcome to Designers Group!' }],
//       2: [{ sender: 'Bob', text: 'Dev Team chat started.' }],
//       3: [{ sender: 'Charlie', text: 'Marketing discussions.' }]
//     },
//     users: {
//       1: [{ sender: 'Alice', text: 'Hi John!' }],
//       2: [], 3: [], 4: [], 5: [], 6: [], 7: []
//     }
//   });

//   const [groups, setGroups] = useState(dummyGroups);

//   const handleSend = () => {
//     if (!messageText.trim()) return;

//     const newChatHistory = { ...chatHistory };

//     if (viewUsers) {
//       const userId = selectedItem.id;
//       if (!newChatHistory.users[userId]) newChatHistory.users[userId] = [];
//       newChatHistory.users[userId].push({ sender: 'You', text: messageText });
//     } else {
//       const groupId = selectedItem.id;
//       if (!newChatHistory.groups[groupId]) newChatHistory.groups[groupId] = [];
//       newChatHistory.groups[groupId].push({ sender: 'You', text: messageText });
//     }

//     setChatHistory(newChatHistory);
//     setMessageText('');
//   };

//   const handleCreateGroup = () => {
//     if (!newGroupName.trim()) return;

//     const newId = groups.length + 1;
//     const newGroup = { id: newId, name: newGroupName };
//     setGroups([...groups, newGroup]);
//     setSelectedGroup(newGroup);
//     setSelectedItem(newGroup);
//     setViewUsers(false);
//     setChatHistory(prev => ({ ...prev, groups: { ...prev.groups, [newId]: [] } }));
//     setNewGroupName('');
//   };

//   const filteredSidebarItems = (viewUsers ? dummyUsers : groups).filter(item =>
//     item.name.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const currentMessages = viewUsers
//     ? chatHistory.users[selectedItem.id] || []
//     : chatHistory.groups[selectedItem.id] || [];

//   return (
//     <div className="dashboard-wrapper">
//       <div className="dashboard-container">
//         {/* HEADER */}
//         <header className="dashboard-header">
//           <div className="header-left">Real-Time Chat App</div>
//           <div className="header-right">
//             <span className="username">Welcome, JohnDoe</span>
//             <button className="logout-button">Logout</button>
//           </div>
//         </header>

//         {/* SEARCH */}
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder={viewUsers ? 'Search users...' : 'Search groups...'}
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//           />
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="action-buttons">
//           {!viewUsers && (
//             <div style={{ display: 'flex', gap: '10px' }}>
//               <input
//                 type="text"
//                 placeholder="New group name"
//                 value={newGroupName}
//                 onChange={(e) => setNewGroupName(e.target.value)}
//               />
//               <button onClick={handleCreateGroup}>Create Group</button>
//             </div>
//           )}
//           <button
//             onClick={() => {
//               setViewUsers(!viewUsers);
//               setSelectedItem(!viewUsers ? dummyUsers[0] : selectedGroup);
//               setSearchText('');
//             }}
//           >
//             {viewUsers ? 'Back to Groups' : 'One-to-One Chat'}
//           </button>
//         </div>

//         {/* MAIN CONTENT */}
//         <div className="main-content">
//           {/* LEFT SIDEBAR */}
//           <div className="sidebar">
//             <h3>{viewUsers ? 'Users' : 'Groups'}</h3>
//             <ul>
//               {filteredSidebarItems.map(item => (
//                 <li
//                   key={item.id}
//                   className={item.id === selectedItem.id ? 'active' : ''}
//                   onClick={() => setSelectedItem(item)}
//                 >
//                   {item.name}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* RIGHT CHAT AREA */}
//           <div className="chat-area">
//             <div className="chat-header">{selectedItem.name}</div>
//             <div className="chat-messages" id="chatMessages">
//               {currentMessages.map((msg, index) => (
//                 <div key={index} className={msg.sender === 'You' ? 'message sent' : 'message received'}>
//                   <span>{msg.text}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="chat-input">
//               <input
//                 type="text"
//                 value={messageText}
//                 onChange={(e) => setMessageText(e.target.value)}
//                 placeholder="Type a message..."
//               />
//               <button onClick={handleSend}>Send</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// --------------------








// import React, { useState, useRef, useEffect } from 'react';
// import './MainChatDashboard.css';

// const dummyGroups = [
//   { id: 1, name: 'Designers Group' },
//   { id: 2, name: 'Dev Team' },
//   { id: 3, name: 'Marketing Team' }
// ];

// const dummyUsers = [
//   { id: 1, name: 'Alice' },
//   { id: 2, name: 'Bob' },
//   { id: 3, name: 'Charlie' },
//   { id: 4, name: 'Eve' },
//   { id: 5, name: 'Mallory' },
//   { id: 6, name: 'Trent' },
//   { id: 7, name: 'Oscar' }
// ];

// export default function MainChatDashboard() {
//   const [viewUsers, setViewUsers] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(dummyGroups[0]);
//   const [selectedGroup, setSelectedGroup] = useState(dummyGroups[0]);
//   const [searchText, setSearchText] = useState('');
//   const [messageText, setMessageText] = useState('');
//   const [newGroupName, setNewGroupName] = useState('');
//   const [chatHistory, setChatHistory] = useState({
//     groups: {
//       1: [{ sender: 'Alice', text: 'Welcome to Designers Group!' }],
//       2: [{ sender: 'Bob', text: 'Dev Team chat started.' }],
//       3: [{ sender: 'Charlie', text: 'Marketing discussions.' }]
//     },
//     users: {
//       1: [{ sender: 'Alice', text: 'Hi John!' }],
//       2: [], 3: [], 4: [], 5: [], 6: [], 7: []
//     }
//   });

//   const [groups, setGroups] = useState(dummyGroups);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [chatHistory, selectedItem]);

//   const handleSend = () => {
//     if (!messageText.trim()) return;
//     const newChatHistory = { ...chatHistory };
//     if (viewUsers) {
//       const userId = selectedItem.id;
//       if (!newChatHistory.users[userId]) newChatHistory.users[userId] = [];
//       newChatHistory.users[userId].push({ sender: 'You', text: messageText });
//     } else {
//       const groupId = selectedItem.id;
//       if (!newChatHistory.groups[groupId]) newChatHistory.groups[groupId] = [];
//       newChatHistory.groups[groupId].push({ sender: 'You', text: messageText });
//     }
//     setChatHistory(newChatHistory);
//     setMessageText('');
//   };

//   const handleCreateGroup = () => {
//     if (!newGroupName.trim()) return;
//     const newId = groups.length + 1;
//     const newGroup = { id: newId, name: newGroupName };
//     setGroups([...groups, newGroup]);
//     setSelectedGroup(newGroup);
//     setSelectedItem(newGroup);
//     setViewUsers(false);
//     setChatHistory(prev => ({ ...prev, groups: { ...prev.groups, [newId]: [] } }));
//     setNewGroupName('');
//   };

//   const filteredSidebarItems = (viewUsers ? dummyUsers : groups).filter(item =>
//     item.name.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const currentMessages = viewUsers
//     ? chatHistory.users[selectedItem.id] || []
//     : chatHistory.groups[selectedItem.id] || [];

//   return (
//     <div className="dashboard-wrapper" style={{ overflow: 'hidden' }}>
//       <div className="dashboard-container" style={{ width: '1000px', margin: '50px auto', height: '700px' }}>

//         {/* HEADER */}
//         <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
//           <div className="header-left">Real-Time Chat App</div>
//           <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//             <span className="username">Welcome, JohnDoe</span>
//             <button className="logout-button">Logout</button>
//           </div>
//         </header>

//         {/* SEARCH */}
//         <div className="search-bar" style={{ padding: '10px 0' }}>
//           <input
//             type="text"
//             placeholder={viewUsers ? 'Search users...' : 'Search groups...'}
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             style={{ width: '100%', padding: '8px' }}
//           />
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="action-buttons" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//           {!viewUsers && (
//             <div style={{ display: 'flex', gap: '10px' }}>
//               <input
//                 type="text"
//                 placeholder="New group name"
//                 value={newGroupName}
//                 onChange={(e) => setNewGroupName(e.target.value)}
//                 style={{ padding: '8px' }}
//               />
//               <button onClick={handleCreateGroup}>Create Group</button>
//             </div>
//           )}
//           <button
//             onClick={() => {
//               setViewUsers(!viewUsers);
//               setSelectedItem(!viewUsers ? dummyUsers[0] : selectedGroup);
//               setSearchText('');
//             }}
//           >
//             {viewUsers ? 'Back to Groups' : 'One-to-One Chat'}
//           </button>
//         </div>

//         {/* MAIN CONTENT */}
//         <div className="main-content" style={{ display: 'flex', height: 'calc(100% - 150px)' }}>

//           {/* LEFT SIDEBAR */}
//           <div className="sidebar" style={{ width: '250px', padding: '10px', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
//             <h3>{viewUsers ? 'Users' : 'Groups'}</h3>
//             <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
//               {filteredSidebarItems.map(item => (
//                 <li
//                   key={item.id}
//                   className={item.id === selectedItem.id ? 'active' : ''}
//                   onClick={() => setSelectedItem(item)}
//                   style={{ padding: '8px', cursor: 'pointer' }}
//                 >
//                   {item.name}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* RIGHT CHAT AREA */}
//           <div className="chat-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px', borderLeft: '1px solid #ccc' }}>
//             <div className="chat-header" style={{ padding: '10px 0', fontWeight: 'bold' }}>{selectedItem.name}</div>
//             <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
//               {currentMessages.map((msg, index) => (
//                 <div key={index} className={msg.sender === 'You' ? 'message sent' : 'message received'} style={{ display: 'flex', justifyContent: msg.sender === 'You' ? 'flex-end' : 'flex-start', margin: '5px 0' }}>
//                   <span style={{ display: 'inline-block', padding: '8px 12px', borderRadius: '15px', maxWidth: '70%', wordWrap: 'break-word', backgroundColor: 'transparent' }}>{msg.text}</span>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//             <div className="chat-input" style={{ display: 'flex', gap: '10px', paddingTop: '10px' }}>
//               <input
//                 type="text"
//                 value={messageText}
//                 onChange={(e) => setMessageText(e.target.value)}
//                 placeholder="Type a message..."
//                 style={{ flex: 1, padding: '8px' }}
//               />
//               <button onClick={handleSend}>Send</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState, useRef, useEffect } from 'react';
import './MainChatDashboard.css';

const dummyGroups = [
  { id: 1, name: 'Designers Group' },
  { id: 2, name: 'Dev Team' },
  { id: 3, name: 'Marketing Team' }
];

const dummyUsers = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
  { id: 4, name: 'Eve' },
  { id: 5, name: 'Mallory' },
  { id: 6, name: 'Trent' },
  { id: 7, name: 'Oscar' }
];

export default function MainChatDashboard( {onLogout }) {
  const [viewUsers, setViewUsers] = useState(false);
  const [selectedItem, setSelectedItem] = useState(dummyGroups[0]);
  const [selectedGroup, setSelectedGroup] = useState(dummyGroups[0]);
  const [searchText, setSearchText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [chatHistory, setChatHistory] = useState({
    groups: {
      1: [{ sender: 'Alice', text: 'Welcome to Designers Group!' }],
      2: [{ sender: 'Bob', text: 'Dev Team chat started.' }],
      3: [{ sender: 'Charlie', text: 'Marketing discussions.' }]
    },
    users: {
      1: [{ sender: 'Alice', text: 'Hi John!' }],
      2: [], 3: [], 4: [], 5: [], 6: [], 7: []
    }
  });

  const [groups, setGroups] = useState(dummyGroups);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, selectedItem]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    const newChatHistory = { ...chatHistory };
    const senderMessage = { sender: 'You', text: messageText };
    const receiverMessage = { sender: 'Other', text: messageText };

    if (viewUsers) {
      const userId = selectedItem.id;
      if (!newChatHistory.users[userId]) newChatHistory.users[userId] = [];
      newChatHistory.users[userId].push(senderMessage);
    } else {
      const groupId = selectedItem.id;
      if (!newChatHistory.groups[groupId]) newChatHistory.groups[groupId] = [];
      newChatHistory.groups[groupId].push(senderMessage);
    }

    setChatHistory(newChatHistory);
    setMessageText('');
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const newId = groups.length + 1;
    const newGroup = { id: newId, name: newGroupName };
    setGroups([...groups, newGroup]);
    setSelectedGroup(newGroup);
    setSelectedItem(newGroup);
    setViewUsers(false);
    setChatHistory(prev => ({ ...prev, groups: { ...prev.groups, [newId]: [] } }));
    setNewGroupName('');
  };

  const filteredSidebarItems = (viewUsers ? dummyUsers : groups).filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const currentMessages = viewUsers
    ? chatHistory.users[selectedItem.id] || []
    : chatHistory.groups[selectedItem.id] || [];

 const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");

  // Option 1 (recommended – controlled by App)
  onLogout();

  // Option 2 (simple fallback)
  // window.location.reload();
};


  return (
    <div className="dashboard-wrapper" style={{ overflow: 'hidden' }}>
      <div className="dashboard-container" style={{ width: '1000px', margin: '10px auto', height: '700px' }}>

        {/* HEADER */}
        <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px',width: '1000px' }}>
          <div className="header-left">Real-Time Chat App</div>
          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span className="username">Welcome, JohnDoe</span>
            <button className="logout-button" onClick={handleLogout}>
  Logout
</button>
          </div>
        </header>

        {/* SEARCH */}
        <div className="search-bar" style={{ padding: '10px 0' }}>
          <input
            type="text"
            placeholder={viewUsers ? 'Search users...' : 'Search groups...'}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="action-buttons" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          {!viewUsers && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="New group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                style={{ padding: '8px' }}
              />
              <button onClick={handleCreateGroup}>Create Group</button>
            </div>
          )}
          <button
            onClick={() => {
              setViewUsers(!viewUsers);
              setSelectedItem(!viewUsers ? dummyUsers[0] : selectedGroup);
              setSearchText('');
            }}
          >
            {viewUsers ? 'Back to Groups' : 'One-to-One Chat'}
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="main-content" style={{ display: 'flex', height: 'calc(100% - 150px)' }}>

          {/* LEFT SIDEBAR */}
          <div className="sidebar" style={{ width: '250px', padding: '10px', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
            <h3>{viewUsers ? 'Users' : 'Groups'}</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {filteredSidebarItems.map(item => (
                <li
                  key={item.id}
                  className={item.id === selectedItem.id ? 'active' : ''}
                  onClick={() => setSelectedItem(item)}
                  style={{ padding: '8px', cursor: 'pointer' }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT CHAT AREA */}
          <div className="chat-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px', borderLeft: '1px solid #ccc' }}>
            <div className="chat-header" style={{ padding: '10px 0', fontWeight: 'bold' }}>{selectedItem.name}</div>
            <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column' }}>
              {currentMessages.map((msg, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: msg.sender === 'You' ? 'flex-end' : 'flex-start', margin: '5px 0',border:"2px solid red" }}>
                  <div style={{ display: 'inline-block', padding: '8px 12px', border:"2px solid red", borderRadius: '15px', maxWidth: '70%', wordWrap: 'break-word', backgroundColor: '#add8e6', textAlign: msg.sender === 'You' ? 'right' : 'left' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input" style={{ display: 'flex', gap: '10px', paddingTop: '10px' }}>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => { if(e.key === 'Enter') handleSend(); }}
                style={{ flex: 1, padding: '8px' }}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}