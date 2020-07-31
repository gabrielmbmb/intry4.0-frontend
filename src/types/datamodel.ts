export interface NewDatamodel {
  name: string;
  plcs: { [key: string]: string[] };
  contamination?: number;
  // PCA Mahalanobis
  pca_mahalanobis?: boolean;
  n_components?: number;
  // Autoencoder
  autoencoder?: boolean;
  hidden_neurons?: string;
  dropout_rate?: number;
  activation?: string;
  kernel_initializer?: string;
  loss_function?: string;
  optimizer?: string;
  epochs?: number;
  batch_size?: number;
  validation_split?: number;
  early_stopping?: boolean;
  // K-Means
  kmeans?: boolean;
  n_clusters?: number;
  max_cluster_elbow?: number;
  // One Class SVM
  ocsvm?: boolean;
  kernel?: string;
  degree?: number;
  gamma?: string;
  coef0?: number;
  tol?: number;
  shrinking?: boolean;
  cache_size?: number;
  // Gaussian Distribution
  gaussian_distribution?: boolean;
  epsilon_candidates?: number;
  // Isolation Forest
  isolation_forest?: boolean;
  n_estimators?: number;
  max_features?: number;
  bootstrap?: boolean;
  // Local Outlier Factor
  lof?: boolean;
  n_neighbors_lof?: number;
  algorithm_lof?: string;
  leaf_size_lof?: number;
  metric_lof?: string;
  p_lof?: number;
  // k-Nearest Neighbors
  knn?: boolean;
  n_neighbors_knn?: number;
  radius?: number;
  algorithm_knn?: string;
  leaf_size_knn?: number;
  metric_knn?: string;
  p_knn?: number;
  score_func?: string;
  [key: string]: any;
}
