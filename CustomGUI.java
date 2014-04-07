import java.awt.event.*;
import java.awt.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.Math;
import javax.swing.BoxLayout;
import javax.swing.*;
import java.util.ArrayList;
import java.util.Arrays;

class CustomGUI extends JFrame implements ActionListener {

	public static String cmd = "python3 customRec.py";
	public static String length = "100";
	public static String depth = "5";

	public static String fd = "forward(length)";
	public static String fdHalf = "forward(length/2)";
	public static String bk = "backward(length)";
	public static String rec = "drawTree(length/2,depth-1)";
	public static String rt = "right(90)";
	public static String lt = "left(90)";
	public static String args;

	public static final String[] CMDS = {
		"move forward",
		"move forward half",
		"move backward",
		"recurse",
		"turn right",
		"turn left"
	};

	public static final String[] VALS = {
		fd,
		fdHalf,
		bk,
		rec,
		rt,
		lt
	};

	public static final ArrayList<String> selectedCommands = new ArrayList<String>();
	public static JList commandList;
	public static JList selectedCommandsList;

	// Initialize the frame
	public CustomGUI () {
		setTitle("Ut Totem - Computer Science project");
		setSize(600, 600);
		setLocation(10,10);
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		// Add default commands
		selectedCommands.add(fd);
		selectedCommands.add(lt);
		selectedCommands.add(fd);
		selectedCommands.add(rec);
		selectedCommands.add(bk);
		selectedCommands.add(rt);
		selectedCommands.add(bk);

		// Add elements to content pane
		addElements(this.getContentPane());

	}

	public void addElements(Container pane) {


		// Set layout
		setLayout(new BoxLayout(pane, BoxLayout.Y_AXIS));

		// This button is used to add commands
		final JButton addButton = new JButton("Add");
		addButton.setActionCommand("Add");
		addButton.addActionListener(this);

		// This button is used to clear commands
		final JButton clearButton = new JButton("Clear");
		clearButton.setActionCommand("Clear");
		clearButton.addActionListener(this);

		// Add list of commands to layout
		commandList = new JList(CMDS);
		commandList.setSelectionMode(ListSelectionModel.SINGLE_INTERVAL_SELECTION);
		commandList.setLayoutOrientation(JList.VERTICAL);
		commandList.addMouseListener(new MouseAdapter() {
			public void mouseClicked(MouseEvent e) {
				if (e.getClickCount() == 2) {
					addButton.doClick(); // emulate button
				}
			}
		});

		// Add list of selected commands to layout
		selectedCommandsList = new JList(selectedCommands.toArray());


		// Add command button
		JButton btn = new JButton("Run program");

		// Register the button's on click listener (the command to exec)
		btn.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				args = "";
				for (String cmd: selectedCommands) {
					args += cmd + " ";
				}
				executeCommand(cmd + " " + length + " " + depth + " " + args);
			}
		});

		// Add buttons to the layout
		pane.add(commandList);
		pane.add(addButton);
		pane.add(clearButton);
		pane.add(selectedCommandsList);
		pane.add(btn);
	}

	// Handle click events for add button
	public void actionPerformed(ActionEvent e) {
		if ("Add".equals(e.getActionCommand())) {
			String val = (String) commandList.getSelectedValue();
			if (val != null) {
				selectedCommands.add(VALS[Arrays.asList(CMDS).indexOf(val)]);
			}

			// Update selected commands
			selectedCommandsList.setListData(selectedCommands.toArray());
		}
		else if ("Clear".equals(e.getActionCommand())) {
			selectedCommands.clear();
			selectedCommandsList.setListData(selectedCommands.toArray());
		}
	}

	// Executes the shell command given
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

	// Sets up GUI and shows it to the user
	public static void main(String[] args) {
		(new CustomGUI()).show();
	}
}
