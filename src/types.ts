export interface Land {
  id: number;
  isSold: boolean;
  owner?: string;
  coordinates: {
    longitude: {
      min: number;
      max: number;
    };
    latitude: {
      min: number;
      max: number;
    };
  };
}

export interface SearchPanelProps {
  lands: Land[];
  onSearchResults: (results: Land[]) => void;
}

export interface LandGridProps {
  lands: Land[];
  loading: boolean;
}

export interface LandCardProps {
  land: Land;
  onClick?: () => void;
}

export interface LandModalProps {
  land: Land;
  imageUrl: string;
  onClose: () => void;
} 