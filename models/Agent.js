app.get('/agents', async (req, res) => {
  try {
    const service = req.query.service;

    let agents;

    if (service) {
      agents = await Agent.find({ service });
    } else {
      agents = await Agent.find({ status: 'verified' });
    }

    // 🔥 convert image paths to full URLs
    const updatedAgents = agents.map(agent => ({
      ...agent._doc,
      profilePicUrl: agent.profilePic
        ? `https://fixme-backend-3.onrender.com/${agent.profilePic}`
        : "",
      kitPicUrl: agent.kitPic
        ? `https://fixme-backend-3.onrender.com/${agent.kitPic}`
        : ""
    }));

    res.json(updatedAgents);

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error" });
  }
});
