
import javax.swing.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;

class GUI extends JFrame {

	public static final String[] CMDS = {
		"python spiro.py"
	};

	public GUI () {
		setTitle("Ut Totem - Computer Science project");
		setSize(300,200); // default size is 0,0
		setLocation(10,200); // default is 0,0 (top left corner)
	}

	public void addButtons() {
		for (String cmd: CMDS) {
			System.out.println(executeCommand(cmd));
		}
	}

	private String executeCommand(String command) {
 
		StringBuffer output = new StringBuffer();
 
		Process p;
		try {
			p = Runtime.getRuntime().exec(command);
			p.waitFor();
			BufferedReader reader = 
                            new BufferedReader(new InputStreamReader(p.getInputStream()));
 
                        String line = "";			
			while ((line = reader.readLine())!= null) {
				output.append(line + "\n");
			}
 
		} catch (Exception e) {
			e.printStackTrace();
		}
 
		return output.toString();
 
	}

	public static void main(String[] args) {
		GUI f = new GUI();
		f.addButtons();
		f.show();
		
	}
}