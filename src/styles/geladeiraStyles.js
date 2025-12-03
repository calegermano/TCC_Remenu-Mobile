import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const geladeiraStyles = StyleSheet.create({
  // === CORES DO WEB ===
  colors: {
    primary: '#4a6fa5',      // Azul principal
    primaryLight: '#e3f2fd', // Azul claro (banner)
    secondary: '#50D9B0',    // Verde água
    warning: '#ffc107',      // Amarelo (dicas)
    danger: '#dc3545',       // Vermelho (vencido)
    success: '#28a745',      // Verde (sucesso)
    light: '#f8f9fa',        // Cinza claro
    dark: '#343a40',         // Cinza escuro
    white: '#ffffff',
    gray100: '#f8f9fa',
    gray200: '#e9ecef',
    gray300: '#dee2e6',
    gray400: '#ced4da',
    gray500: '#adb5bd',
    gray600: '#6c757d',
    gray700: '#495057',
    gray800: '#343a40',
    gray900: '#212529',
  },

  // === TIPOGRAFIA ===
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: '700',
      color: '#333',
      lineHeight: 36,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      color: '#333',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      color: '#333',
      lineHeight: 28,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      color: '#495057',
      lineHeight: 24,
    },
    small: {
      fontSize: 14,
      color: '#6c757d',
      lineHeight: 20,
    },
    xsmall: {
      fontSize: 12,
      color: '#6c757d',
      lineHeight: 16,
    },
  },

  // === COMPONENTES ESPECÍFICOS ===
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  // Botões como no web
  buttonPrimary: {
    backgroundColor: '#4a6fa5',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  // Badges
  badge: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },

  // Item de ingrediente
  ingredienteItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  ingredienteItemExpired: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },

  // Autocomplete
  autocompleteContainer: {
    position: 'relative',
    zIndex: 1000,
  },

  autocompleteList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  autocompleteItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },

  // Layout responsivo
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  content: {
    padding: 16,
  },

  row: {
    flexDirection: 'row',
    gap: 16,
  },

  col: {
    flex: 1,
  },

  // Spacing
  mb1: { marginBottom: 4 },
  mb2: { marginBottom: 8 },
  mb3: { marginBottom: 12 },
  mb4: { marginBottom: 16 },
  mb5: { marginBottom: 20 },

  mt1: { marginTop: 4 },
  mt2: { marginTop: 8 },
  mt3: { marginTop: 12 },
  mt4: { marginTop: 16 },
  mt5: { marginTop: 20 },

  // Flex
  flexRow: { flexDirection: 'row' },
  flexCol: { flexDirection: 'column' },
  alignItemsCenter: { alignItems: 'center' },
  justifyContentBetween: { justifyContent: 'space-between' },
  gap2: { gap: 8 },
  gap3: { gap: 12 },
  gap4: { gap: 16 },
});