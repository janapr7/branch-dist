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
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from "@chakra-ui/react";
import { useNavigate} from "react-router-dom";
import { useState, useEffect } from "react"
import axios from "axios";
import { URL_GEO, URL_ONGKIR, URL_API } from '../helper'

export const Branch = () => {
    const navigate = useNavigate();
    const [branchs, setBranchs] = useState([]);
    const [sorted, setSorted] = useState("");

    useEffect(() => {
        async function fetchBranchs() {
            let url = `${URL_API}/branch`;

            // const data = {token: tokens}

            const branchData = await axios.get(url);
            setBranchs(branchData.data.data);
            console.log("Hasil")
            console.log(branchs)
            console.log("Hasil2")
        }
        fetchBranchs();
    }, []);

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

    const getUserLocation = async () => {
        const data = {
            userPlace: document.getElementById("userLocation").value,

        };

        console.log("masuk")
        const urlPlace = `${URL_GEO}&q=${data.userPlace}`;
        const resultPlace = await axios.get(urlPlace);
        const placeData = resultPlace.data.results[0].geometry
        console.log("user loc", placeData)
        return placeData

        // return getDistance(placeData.lat, placeData.lng, branchs[branch_idx].lat, branchs[branch_idx].lng, "K").toFixed(2)
    };

    async function sortBranch(){
        const userPlace = await getUserLocation()

        let temp = []
        for(let i=0; i<branchs.length; i++){
            let dist = getDistance(parseFloat(userPlace.lat), parseFloat(userPlace.lng), parseFloat(branchs[i].lat), parseFloat(branchs[i].lng), "K").toFixed(2)
            temp.push({branch_id: branchs[i].id, branch_name: branchs[i].branch_name, dist})
            //getDistance(parseFloat(userPlace.lat), parseFloat(userPlace.lng), parseFloat(branchs[i].lat), parseFloat(branchs[i].lng), "K")
        }
          
        let sortedArr = temp.sort(function(a,b) {return a.dist - b.dist});

        let text = ""
        for(let j=0; j<sortedArr.length; j++){
            text += `${sortedArr[j].branch_name} (${sortedArr[j].dist} km)`
            if(j != sortedArr.length-1){
                text += ", "
            }
        }

        setSorted(text)
        return 0
    }

    return (
        <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
        >
            <Stack spacing={8} mx={"auto"} maxW={"1000 px"} py={12} px={6} w={1000}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"} textAlign={"center"}>
                        Branch List
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
                            <FormControl id="userLocation" isRequired>
                                <FormLabel>User Location</FormLabel>
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
                                onClick={sortBranch}
                                color="white"
                            >
                                Sort Branch Distance (ASC)
                            </Button>
                        </Stack>                        
                    </Stack>
                </Box>
                <TableContainer>
                <Table variant='simple'>
                    <TableCaption>Sorted Branch: {sorted}</TableCaption>
                    <Thead>
                    <Tr>
                        <Th>Branch Name</Th>
                        <Th>Province</Th>
                        <Th>City</Th>
                        <Th>Lng</Th>
                        <Th>Lat</Th>
                        <Th>Action</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                    {branchs.map((branch)=>{
                        return (
                            <Tr>
                                <Td>{branch.branch_name}</Td>
                                <Td>{branch.province}</Td>
                                <Td>{branch.city}</Td>
                                <Td isNumeric>{branch.lng}</Td>
                                <Td isNumeric>{branch.lat}</Td>
                                <Td><a>Edit</a> <a>Delete</a></Td>
                            </Tr>
                        )
                    })}
                    </Tbody>
                    <Tfoot>
                    </Tfoot>
                </Table>
            </TableContainer>
            </Stack>
        </Flex>
    );
};
