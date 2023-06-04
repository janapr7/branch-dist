import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    Select,
} from "@chakra-ui/react";
import { useNavigate} from "react-router-dom";
import { useState } from "react"
import axios from "axios";
import { URL_GEO } from '../helper'

export const Home = () => {
    const navigate = useNavigate();
    const [dist, setDist] = useState(0);

    function getDistance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist;
        }
    }


    const calculateDistance = async () => {
        const data = {
            place1: document.getElementById("place1").value,
            place2: document.getElementById("place2").value,

        };

        const url1 = `${URL_GEO}&q=${data.place1}`;
        const result1 = await axios.get(url1);
        const res1 = result1.data.results[0].geometry
        console.log("res1", res1)

        const url2 = `${URL_GEO}&q=${data.place2}`;
        const result2 = await axios.get(url2);
        const res2 = result2.data.results[0].geometry
        console.log("res2", res2)

        const distResult = getDistance(res1.lat, res1.lng, res2.lat, res2.lng, "K").toFixed(2)
        setDist(distResult)
        // setDist(res1.lat)
    };
    return (
        <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
        >
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} w={500}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"} textAlign={"center"}>
                        Calculate Distance
                    </Heading>
                </Stack>
                <Box
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    p={8}
                >
                    <Stack spacing={4}>
                        <VStack>
                            <FormControl id="place1" isRequired>
                                <FormLabel>Place Name (1)</FormLabel>
                                <Input type="text"/>
                            </FormControl>
                            <FormControl id="place2" isRequired>
                                <FormLabel>Place Name (2)</FormLabel>
                                <Input type="text"/>
                            </FormControl>
                        </VStack>
                        <Stack spacing={10} pt={2}>
                            <Button loadingText="Submitting"
                                size="lg"
                                bg={"blue.400"}
                                _hover={{
                                    bg: "blue.300",
                                }}
                                variant="solid"
                                onClick={calculateDistance}
                                color="white"
                            >
                                Calculate
                            </Button>
                        </Stack>
                        <Stack spacing={10} pt={2}>
                            <Text>Distance: {dist} km</Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
};
