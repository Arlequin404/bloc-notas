import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  ActivityIndicator,
  Keyboard,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trash2, Plus, NotepadText, Edit3, Save, X } from 'lucide-react-native';
import { db } from './firebaseConfig';
import { 
  ref, 
  onValue, 
  push, 
  set, 
  remove, 
  update, 
  serverTimestamp 
} from 'firebase/database';

/**
 * Super Notas App
 * Una aplicación de notas colaborativa en tiempo real.
 * Funciona en Web, Android e iOS.
 */
export default function App() {
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState({ visible: false, message: '', type: 'success' });

  // Función para mostrar notificaciones
  const showNotification = (message, type = 'success') => {
    setNotification({ visible: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };


  // Suscripción en tiempo real a la base de datos (Realtime Database)
  useEffect(() => {
    const notesRef = ref(db, 'mensaje');
    
    // El listener onValue se activa cada vez que hay cambios en la ruta 'mensaje'
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convertir el objeto de Firebase en una lista para FlatList
        const notesList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        // Ordenar por timestamp descendente (más recientes arriba)
        // Nota: Si el timestamp no existe aún (serverTimestamp pendiente), usamos la fecha actual
        notesList.sort((a, b) => (b.timestamp || Date.now()) - (a.timestamp || Date.now()));
        
        setNotes(notesList);
      } else {
        setNotes([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error al obtener notas: ", error);
      showNotification("Error al cargar las notas", "error");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Función para Guardar o Actualizar una nota
  const handleSubmit = async () => {
    if (content.trim() === '') return;

    setIsProcessing(true);
    try {
      if (editingId) {
        // Actualizar nota existente
        const noteRef = ref(db, `mensaje/${editingId}`);
        await update(noteRef, {
          texto: content,
          updatedAt: serverTimestamp()
        });
        setEditingId(null);
        showNotification("Nota actualizada con éxito");
      } else {
        // Crear nueva nota
        const notesRef = ref(db, 'mensaje');
        const newNoteRef = push(notesRef);
        await set(newNoteRef, {
          texto: content,
          timestamp: serverTimestamp()
        });
        
        // También actualizamos el campo 'ultimo_mensaje' en la raíz
        await set(ref(db, 'ultimo_mensaje'), serverTimestamp());
        showNotification("Nota guardada correctamente");
      }
      
      // Limpiar campos y cerrar teclado
      setContent('');
      Keyboard.dismiss();
    } catch (error) {
      console.error("Error al guardar nota: ", error);
      showNotification("Error al guardar la nota", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Eliminar una nota
  const deleteNote = async (id) => {
    setIsProcessing(true);
    try {
      const noteRef = ref(db, `mensaje/${id}`);
      await remove(noteRef);
      if (editingId === id) cancelEdit();
      showNotification("Nota eliminada");
    } catch (error) {
      console.error("Error al eliminar nota: ", error);
      showNotification("Error al eliminar la nota", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Iniciar modo edición
  const startEdit = (item) => {
    setEditingId(item.id);
    setContent(item.texto);
  };

  // Cancelar edición
  const cancelEdit = () => {
    setEditingId(null);
    setContent('');
    Keyboard.dismiss();
  };

  // Formatear fecha para mostrar
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Componente de Notificación
  const Notification = () => {
    if (!notification.visible) return null;
    return (
      <View style={[styles.notificationContainer, notification.type === 'error' ? styles.errorNotification : styles.successNotification]}>
        <Text style={styles.notificationText}>{notification.message}</Text>
      </View>
    );
  };

  // Renderizado de cada tarjeta de nota
  const renderItem = ({ item }) => (
    <View style={styles.noteCard}>
      <View style={styles.noteHeader}>
        <Text style={styles.noteContent}>{item.texto}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={() => startEdit(item)} 
            style={styles.actionButton}
            disabled={isProcessing}
          >
            <Edit3 size={18} color="#4ecca3" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => deleteNote(item.id)} 
            style={styles.actionButton}
            disabled={isProcessing}
          >
            <Trash2 size={18} color="#ff4d4d" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.noteDate}>{formatDate(item.timestamp)}</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <View style={styles.responsiveWrapper}>
        <StatusBar barStyle="light-content" />
        
        <Notification />
        
        {isProcessing && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color="#4ecca3" />
            <Text style={styles.processingText}>Procesando...</Text>
          </View>
        )}

        <View style={styles.header}>
          <NotepadText color="#4ecca3" size={32} />
          <Text style={styles.title}>Super Notas</Text>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputSection}
        >
          <View style={styles.formContainer}>
            <TextInput
              style={styles.contentInput}
              placeholder="¿Qué tienes en mente? Escribe aquí..."
              placeholderTextColor="#777"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              editable={!isProcessing}
            />
            <View style={styles.buttonRow}>
              {editingId && (
                <TouchableOpacity 
                  style={[styles.submitButton, styles.cancelButton]} 
                  onPress={cancelEdit}
                  disabled={isProcessing}
                >
                  <X size={20} color="#fff" />
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.submitButton, editingId ? styles.updateButton : styles.addButton, isProcessing && styles.disabledButton]} 
                onPress={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    {editingId ? <Save size={20} color="#fff" /> : <Plus size={20} color="#fff" />}
                    <Text style={styles.buttonText}>{editingId ? 'Actualizar' : 'Añadir Nota'}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4ecca3" />
          </View>
        ) : (
          <FlatList
            data={notes}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No hay notas todavía. ¡Sé el primero!</Text>
            }
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'web' ? 40 : 60,
  },
  responsiveWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
    letterSpacing: 1,
  },
  inputSection: {
    marginBottom: 25,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  contentInput: {
    color: '#eee',
    fontSize: 16,
    paddingHorizontal: 10,
    minHeight: 120, // Más alto por ser el único campo
    maxHeight: 200,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButton: {
    backgroundColor: '#4ecca3',
  },
  updateButton: {
    backgroundColor: '#3498db',
  },
  cancelButton: {
    backgroundColor: '#555',
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 40,
  },
  noteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  noteContent: {
    color: '#eee',
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    marginRight: 10,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  noteDate: {
    color: '#555',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'right',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  notificationContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 12,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  successNotification: {
    backgroundColor: 'rgba(78, 204, 163, 0.9)',
  },
  errorNotification: {
    backgroundColor: 'rgba(255, 77, 77, 0.9)',
  },
  notificationText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  processingText: {
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
});
