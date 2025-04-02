
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, AlertCircle, Globe } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { motion } from 'framer-motion';

const signInSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

const signUpSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

const AuthPage = () => {
  const { signIn, signUp, signInWithGoogle, resetPassword, isLoading, error, clearErrors } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('signin');
  const [showResetPassword, setShowResetPassword] = useState(false);
  
  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  
  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSignInSubmit = async (values: z.infer<typeof signInSchema>) => {
    await signIn(values.email, values.password);
  };

  const onSignUpSubmit = async (values: z.infer<typeof signUpSchema>) => {
    await signUp(values.email, values.password, values.name);
  };

  const onResetPasswordSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    await resetPassword(values.email);
    setShowResetPassword(false);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    clearErrors();
    if (showResetPassword) setShowResetPassword(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 } 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <motion.div 
        className="w-full max-w-md space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center space-y-2" variants={itemVariants}>
          <h1 className="text-3xl font-bold">CalFit</h1>
          <p className="text-muted-foreground">Connectez-vous pour suivre votre nutrition</p>
        </motion.div>

        {error && (
          <motion.div variants={itemVariants}>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {showResetPassword ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.h2 className="text-xl font-semibold text-center" variants={itemVariants}>
              Réinitialiser votre mot de passe
            </motion.h2>
            
            <Form {...resetPasswordForm}>
              <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
                <motion.div variants={itemVariants}>
                  <FormField
                    control={resetPasswordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="votre@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div className="flex space-x-2" variants={itemVariants}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-1/2"
                    onClick={() => setShowResetPassword(false)}
                    disabled={isLoading}
                  >
                    Retour
                  </Button>
                  <Button type="submit" className="w-1/2" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                    Envoyer
                  </Button>
                </motion.div>
              </form>
            </Form>
          </motion.div>
        ) : (
          <motion.div className="space-y-4" variants={itemVariants}>
            <Tabs 
              defaultValue="signin" 
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Connexion</TabsTrigger>
                <TabsTrigger value="signup">Inscription</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={signInForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="votre@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={signInForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Button
                        type="button"
                        variant="link"
                        className="px-0 font-normal text-sm"
                        onClick={() => setShowResetPassword(true)}
                      >
                        Mot de passe oublié ?
                      </Button>
                    </motion.div>

                    <div className="space-y-2">
                      <motion.div variants={itemVariants}>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Se connecter
                        </Button>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => signInWithGoogle()}
                          disabled={isLoading}
                        >
                          <Globe className="mr-2 h-4 w-4" />
                          Continuer avec Google
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={signUpForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Votre nom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="votre@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <div className="space-y-2">
                      <motion.div variants={itemVariants}>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          S'inscrire
                        </Button>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => signInWithGoogle()}
                          disabled={isLoading}
                        >
                          <Globe className="mr-2 h-4 w-4" />
                          Continuer avec Google
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthPage;
