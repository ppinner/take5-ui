import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import DoDisturbAltOutlinedIcon from '@mui/icons-material/DoDisturbAltOutlined';
import React from "react";

export const goals = {
    mindfulness: 'Mindfulness',
    giving: 'Giving',
    connection: 'Connection',
    physicalActivity: 'Physical Activity',
    learning: 'Learning',
};

export const personalityTraits = {
    extroversion: 'Extroversion',
    neuroticism: 'Neuroticism',
    agreeableness: 'Agreeableness',
    conscientiousness: 'Conscientiousness',
    openness: 'Openness'
};

export const personalityTraitDesc = {
    extroversion: 'The personality trait of seeking fulfillment from sources outside the self or ' +
        'in community. High scorers tend to be very social while low scorers prefer to work on their ' +
        'projects alone.',
    neuroticism: 'The personality trait of being emotional.',
    agreeableness: 'Reflects much individuals adjust their behavior to suit others. High scorers ' +
        'are typically polite and like people. Low scorers tend to \'tell it like it is\'.',
    conscientiousness: 'The personality trait of being honest and hardworking. High scorers ' +
        'tend to follow rules and prefer clean homes. Low scorers may be messy and cheat others.',
    openness: 'The personality trait of seeking new experience and intellectual ' +
        'pursuits. High scorers may daydream a lot. Low scorers may be very down to earth.'
};

/*
    From the Material UI documentation for Slider element with custom icons:
    https://mui.com/material-ui/react-rating/#radio-group
 */
export const emoticons = {
    0: {
        icon: <DoDisturbAltOutlinedIcon/>,
        label: 'No emotion recorded'
    },
    1: {
        icon: <SentimentVeryDissatisfiedIcon/>,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon/>,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon/>,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon/>,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon/>,
        label: 'Very Satisfied',
    },
};