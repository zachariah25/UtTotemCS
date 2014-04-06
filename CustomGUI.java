
import java.awt.Container;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.Math;
import javax.swing.BoxLayout;
import javax.swing.*;

class CustomGUI extends JFrame {

	public static String cmd = "forward(length)\nleft(length)\nforward(length)\ndrawTree(length / 2, depth - 1)\nback(length)\nright(length)\nback(length)\n";

	// Initialize the frame
	public CustomGUI () {
		setTitle("Ut Totem - Computer Science project");
		setSize(600, 600);
		setLocation(10,200);
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		addButtons(this.getContentPane());
	}

	public void addButtons(Container pane) {

		// Set layout
		setLayout(new BoxLayout(pane, BoxLayout.Y_AXIS));

		JButton btn;
		btn = new JButton("Run program");

		// Register the button's on click listener (the command to exec)
		btn.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				executeCommand("python3 customRec.py 100 3 \"" + cmd + "\"");
			}
		});

		// Add this button to the layout
		pane.add(btn);
	}

	// Executes the shell command given
	private String executeCommand(String command) {
 
		StringBuffer output = new StringBuffer();
 
		Process p;
		try {
			p = Runtime.getRuntime().exec(command);
			//p.waitFor();
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

	// Sets up GUI and shows it to the user
	public static void main(String[] args) {
		(new CustomGUI()).show();
	}
}
