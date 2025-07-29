from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint
import numpy as np

def train_model(X_train, y_train, model_type='rf'):
    if model_type == 'xgb':
        param_dist = {
            'n_estimators': randint(50, 300),
            'max_depth': randint(3, 10),
            'learning_rate': [0.01, 0.05, 0.1, 0.2],
            'subsample': [0.6, 0.8, 1.0],
            'colsample_bytree': [0.6, 0.8, 1.0]
        }
        base_model = XGBClassifier(
            use_label_encoder=False,
            eval_metric='mlogloss',
            random_state=42
        )
    elif model_type == 'rf':
        param_dist = {
            'n_estimators': randint(100, 300),
            'max_depth': randint(5, 30),
            'min_samples_split': randint(2, 10),
            'min_samples_leaf': randint(1, 5),
            'bootstrap': [True, False]
        }
        base_model = RandomForestClassifier(
            class_weight='balanced',
            random_state=42
        )
    else:
        raise ValueError("Unsupported model_type. Choose 'xgb' or 'rf'.")

    random_search = RandomizedSearchCV(
        estimator=base_model,
        param_distributions=param_dist,
        n_iter=30,
        scoring='accuracy',
        cv=3,
        verbose=1,
        random_state=42,
        n_jobs=-1
    )

    random_search.fit(X_train, y_train)
    best_model = random_search.best_estimator_

    return best_model


