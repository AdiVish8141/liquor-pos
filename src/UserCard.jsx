function UserCard(props) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "15px",
      borderRadius: "10px",
      width: "200px",
      textAlign: "center"
    }}>
      <h2>{props.name}</h2>
      <p>{props.role}</p>
      <button>Follow</button>
    </div>
  );
}

export default UserCard;