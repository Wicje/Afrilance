export const allAccess = (req, res) => {
    res.status(200).send('PublicContent.');
};

export const  userBoard = (req, res) => {
    res.status(200).send('User Content');
};

export const moderatorBoard = (req, res) => {
    res.status(200).send('Moderator Board');
};

export const  adminBoard = (req, res) => {
    res.status(200).send('Admin Board');
};