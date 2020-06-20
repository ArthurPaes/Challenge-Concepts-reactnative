import React, {useEffect, useState, } from 'react'
import api from './services/api'

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";


export default function App() {

  const [repositories, setRepositories] = useState([]);

    useEffect(()=>{
        api.get('repositories').then(response =>{
            
            setRepositories(response.data)
        })
    }, [])

    async function handleAddRepository(){
        const response = await api.post('repositories',{
            title: `teste projeto ${Date.now()}`,
            url: 'github.com',
            techs: 'react',
            likes:0
        });

        const repository = response.data

        setRepositories([...repositories, repository])
    }


  async function handleLikeRepository(id) {
    

    const repositoryToUpdate = repositories.find(repositories => repositories.id === id);
    const response = await api.post(`repositories/${id}/like`);
    const repository = response.data;
    const array = repositories.filter((repository) => { return repository.id !== repositoryToUpdate.id } )
    setRepositories([...array, repository]);
    
  }


  

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <View style={styles.repositoryContainer} >
        <FlatList 
        data={repositories}
        keyExtractor={repository =>repository.id}
        renderItem={({item:repository })=>(  
            <>    
            <Text style={styles.repository} >{repository.title}</Text>
            <TouchableOpacity
            style={styles.button}
            onPress={() => handleLikeRepository(repository.id)}
            // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
            testID={`like-button-${repository.id}`}
          >
            <Text style={styles.buttonText}>Curtir</Text>
          </TouchableOpacity>
            <Text style={styles.repository} testID={`repository-likes-${repository.id}`} >{repository.likes} curtidas</Text>

            
          

            </>
        )}
        />

          <View style={styles.techsContainer}>
            <Text style={styles.tech}>
              ReactJS
            </Text>
            <Text style={styles.tech}>
              Node.js
            </Text>
          </View>

          <View style={styles.likesContainer}>
            <Text
              style={styles.likeText}
              // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
              
            >
            
            </Text>
          </View>

        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
