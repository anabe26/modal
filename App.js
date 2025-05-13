import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ImageBackground,
  Animated,
  Easing
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [alcool, setAlcool] = useState('');
  const [gasolina, setGasolina] = useState('');
  const [resultado, setResultado] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const carregarDados = async () => {
      const alc = await AsyncStorage.getItem('alcool');
      const gas = await AsyncStorage.getItem('gasolina');
      if (alc && gas) {
        setAlcool(alc);
        setGasolina(gas);
      }
    };
    carregarDados();

    // Animação pulsante
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  const calcular = async () => {
    const valAlcool = parseFloat(alcool.replace(',', '.'));
    const valGasolina = parseFloat(gasolina.replace(',', '.'));

    if (isNaN(valAlcool) || isNaN(valGasolina)) {
      Alert.alert('Erro', 'Preencha os valores corretamente.');
      return;
    }

    await AsyncStorage.setItem('alcool', alcool);
    await AsyncStorage.setItem('gasolina', gasolina);

    const proporcao = valAlcool / valGasolina;
    const combustivel = proporcao < 0.7 ? 'ÁLCOOL' : 'GASOLINA';
    setResultado(
      <View style={styles.resultContent}>
        <Text style={styles.resultLabel}>MELHOR OPÇÃO:</Text>
        <Text style={styles.resultValue}>{combustivel}</Text>
        <Text style={styles.resultRatio}>Proporção: {proporcao.toFixed(2)}</Text>
        <View style={styles.resultBar}>
          <View style={[
            styles.resultProgress, 
            {width: `${Math.min(proporcao * 100, 100)}%`},
            proporcao < 0.7 ? styles.alcoholBar : styles.gasolineBar
          ]} />
        </View>
      </View>
    );
    setVisibleModal(true);
  };

  return (
    <ImageBackground 
      source={require('./assets/cyber-bg.jpg')} // Substitua por sua imagem ou cor sólida
      style={styles.container}
      blurRadius={2}
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.appName}>CALCULE</Text>
          <Text style={styles.appSubtitle}>Compare</Text>
          <View style={styles.headerLine} />
        </View>

        <Animated.View style={[styles.card, {transform: [{scale: pulseAnim}]}]}>
          <Text style={styles.title}>⛽ COMPARADOR DE COMBUSTÍVEL</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PREÇO DO ÁLCOOL</Text>
            <TextInput
              placeholder="Ex: 3,50"
              placeholderTextColor="#8E8E93"
              style={styles.input}
              keyboardType="numeric"
              value={alcool}
              onChangeText={setAlcool}
            />
            <View style={styles.inputUnderline} />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PREÇO DA GASOLINA</Text>
            <TextInput
              placeholder="Ex: 5,20"
              placeholderTextColor="#8E8E93"
              style={styles.input}
              keyboardType="numeric"
              value={gasolina}
              onChangeText={setGasolina}
            />
            <View style={styles.inputUnderline} />
          </View>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={calcular}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>CALCULAR</Text>
            <View style={styles.buttonGlow} />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>by Ana</Text>
          <Text style={styles.footerVersion}>v2.0</Text>
        </View>
      </View>

      <Modal transparent={true} visible={visibleModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>RESULTADO</Text>
            </View>
            {resultado}
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setVisibleModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>FECHAR</Text>
              <View style={styles.modalButtonGlow} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A12',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,10,18,0.8)',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00F0FF',
    textShadowColor: 'rgba(0, 240, 255, 0.75)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
    letterSpacing: 5,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#FF00F5',
    letterSpacing: 3,
    marginTop: 5,
  },
  headerLine: {
    height: 2,
    width: '50%',
    backgroundColor: '#FF00F5',
    marginTop: 15,
    opacity: 0.6,
  },
  card: {
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#00F0FF',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 20, 0.5)',
    padding: 12,
    borderRadius: 4,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.2)',
  },
  inputUnderline: {
    height: 1,
    backgroundColor: '#00F0FF',
    marginTop: 4,
    opacity: 0.3,
  },
  button: {
    backgroundColor: 'rgba(255, 0, 245, 0.1)',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 245, 0.5)',
    overflow: 'hidden',
    position: 'relative',
  },
  buttonText: {
    color: '#FF00F5',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
    position: 'relative',
    zIndex: 2,
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(255, 0, 245, 0.2)',
    zIndex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'flex-end',
  },
  footerText: {
    color: 'rgba(0, 240, 255, 0.5)',
    fontSize: 12,
  },
  footerVersion: {
    color: 'rgba(255, 0, 245, 0.5)',
    fontSize: 10,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 10, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: 'rgba(20, 20, 40, 0.95)',
    width: '80%',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 20,
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 0, 245, 0.3)',
    paddingBottom: 12,
    marginBottom: 20,
  },
  modalTitle: {
    color: '#00F0FF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  resultContent: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: 1,
  },
  resultValue: {
    color: '#FF00F5',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textShadowColor: 'rgba(255, 0, 245, 0.5)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 5,
  },
  resultRatio: {
    color: '#00F0FF',
    fontSize: 16,
    marginBottom: 16,
  },
  resultBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 12,
  },
  resultProgress: {
    height: '100%',
    borderRadius: 4,
  },
  alcoholBar: {
    backgroundColor: '#FF00F5',
  },
  gasolineBar: {
    backgroundColor: '#00F0FF',
  },
  modalButton: {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.5)',
    overflow: 'hidden',
    position: 'relative',
  },
  modalButtonText: {
    color: '#00F0FF',
    fontWeight: 'bold',
    letterSpacing: 1,
    position: 'relative',
    zIndex: 2,
  },
  modalButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(0, 240, 255, 0.2)',
    zIndex: 1,
  },
});