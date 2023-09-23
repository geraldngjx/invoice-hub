rm -r lambda_artifact.zip
rm -rf dep
pip3 install -t dep -r requirements.txt
(cd dep; zip ../lambda_artifact.zip -r .)
zip lambda_artifact.zip -u lambda_function.py
zip lambda_artifact.zip -u models.py