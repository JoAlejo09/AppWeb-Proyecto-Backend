import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
import FacebookStrategy from 'passport-facebook'
import Usuario from '../models/Usuario.js'

passport.use(new GoogleStrategy ({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.URL_BACKEND}/auth/google/callback`
},
async (accessToken, refreshToken, profile, done)=>{
    try {
        const correo = profile.emails[0].value;
        let usuario = await Usuario.findOne({correo});
        if(!usuario){
            usuario = await Usuario.create({
                nombre: profile.displayName,
                correo,
                password:null,
                rol: 'paciente',
                verificado: true
            });
        }
        return done(null, usuario);
    } catch(error){
        console.error('Error en GoogleStrategy:', error); // <--
        return done(error, false);
        
    }
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: `${process.env.URL_BACKEND}/auth/facebook/callback`,
  profileFields: ['id', 'emails', 'name', 'displayName']
},
async (accessToken, refreshToken, profile, done)=>{
    try {
        const correo = profile.emails?[0]?.value || `${profile.id}@facebook.com`;
        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            usuario = await Usuario.create({
                nombre: profile.displayName,
                correo,
                password: null,
                rol: 'paciente',
                verificado: true
            });
        }
        return done(null, usuario);
    } catch (error) {
        return done(error, false);    
    }
}));
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async(id, done) => {
  const user = await Usuario.findById(id);
  done(null, user);
});