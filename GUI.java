
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.GridLayout;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.Math;
import javax.swing.*;

class GUI extends JFrame {

	// All commands the user can see
	// First string is user-visible title, second is shell command
	public static final String[][] CMDS = {
		{"Spirograph", "python spiro.py"},
		{"Recursive tree", "python drawTree.py"},
		{"Recursive square", "python squareRec.py"},
		{"Recursive I-shaped drawing", "python iTree.py"}
	};

	// Initialize the frame
	public GUI () {
		setTitle("Ut Totem - Computer Science project");
		setSize(600, 600);
		setLocation(10,200);
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		addButtons();
	}

	public void addButtons() {
		// Calculate how man row / columns we need
		int dim = (int) (Math.sqrt(CMDS.length) + 0.5);
		// Set layout
		setLayout(new GridLayout(dim, dim));

		JButton btn;
		for (final String[] cmd: CMDS) {
			// Initialize button with user-visible name
			btn = new JButton(cmd[0]);

			// Register the button's on click listener (the command to exec)
			btn.addActionListener(new ActionListener() {
				public void actionPerformed(ActionEvent e) {
					executeCommand(cmd[1]);
				}
			});

			// Add this button to the layout
			add(btn);
		}
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
		(new GUI()).show();
	}
}