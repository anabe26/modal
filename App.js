import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  StyleSheet,
} from 'react-native';

export default function App() {
  const [modalVisivel, setModalVisivel] = useState(false);

  const abrirModal = () => setModalVisivel(true);
  const fecharModal = () => setModalVisivel(false);

  return (
    <View style={styles.container}>
      <Button title="Entrar" onPress={abrirModal} color="#7f5af0" />

      <Modal
        visible={modalVisivel}
        transparent={true}
        animationType="slide"
        onRequestClose={fecharModal}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.titulo}>🌌 Seja Bem-Vindo!</Text>
            <Button title="Sair" onPress={fecharModal} color="#2cb67d" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 🎨 Estilos no mesmo arquivo (CSS via StyleSheet)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#16161a',
    padding: 30,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    elevation: 10,
  },
  titulo: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
});
