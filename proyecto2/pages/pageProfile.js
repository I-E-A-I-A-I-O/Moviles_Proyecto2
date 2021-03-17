import React, { useState } from 'react';
import { ScrollView, Text, View, Button, Image } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

function pageProfile({ navigation, userData, sessionToken }) {

    const data = {
        labels: ['Created tasks', 'Completed tasks', 'Current tasks', 'Pinned tasks'],
        datasets: [
            {
                data: [1, 2, 3, 4]
            }
        ]
    };

    return (
        <ScrollView >

            <Card containerStyle={{ backgroundColor: '#1F262A', borderColor: '#6699FF' }} >
                <Card.Image
                    style={{ width: '100%', height: 250 }}
                    source={{ uri: userData.avatar }} />
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Card.Divider />
                    <Text style={{ color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: 25 }}>{userData.name}</Text>
                    <Card.Divider />
                </View>

                <Card.Divider />

                <Button
                    title={'Edit Profile'}
                    onPress={() => {
                        navigation.navigate('pageEditProfile');
                    }}>
                </Button>

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Card.Divider />
                    <Text style={{ color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: 25 }}>Your Stats</Text>
                    <Card.Divider />
                </View>
            </Card>
            <BarChart
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={0}
            />
        </ScrollView>
    )
}

const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 1,
    useShadowColorFromDataset: false // optional
};

const mapStateToProps = (state) => {
    return {
        sessionToken: state.sessionToken,
        userData: state.userData
    }
}


export default connect(mapStateToProps, null)(pageProfile);
