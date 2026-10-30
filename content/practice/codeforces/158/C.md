---
title: "CF 158C - Cd 和 pwd 命令"
description: "我们需要模拟一个仅支持两个命令的小 shell。 命令 cd path 更改当前目录。 该路径可以是绝对路径，这意味着它从根 / 开始，也可以是相对路径，这意味着它从当前目录开始。 在路径内，令牌.."
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special", "data-structures", "implementation"]
categories: ["algorithms"]
codeforces_contest: 158
codeforces_index: "C"
codeforces_contest_name: "VK Cup 2012 Qualification Round 1"
rating: 1400
weight: 158
solve_time_s: 105
verified: true
draft: false
---

[CF 158C - Cd 和 pwd 命令](https://codeforces.com/problemset/problem/158/C)

 **评分：** 1400
 **标签：** *特殊、数据结构、实现
 **求解时间：** 1m 45s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要模拟一个仅支持两个命令的小 shell。 

命令`cd path`更改当前目录。 该路径可以是绝对的，这意味着它从根开始`/`或相对，表示从当前目录开始。 在路径内部，令牌`..`意思是“转到父目录”。 

命令`pwd`打印当前目录的完整绝对路径，始终以尾部斜杠结尾。 

文件系统本身不需要构建为树。 该问题保证每个引用的目录都存在，并且目录名称只是标签。 真正重要的是从根目录到当前位置的目录名称顺序。 

命令数量最多为 50 个，每个路径长度最多为 200 个字符。 这些限制非常小。 即使重复重建路径或多次分割字符串也是完全安全的。 任何在总输入大小上接近线性的解决方案都会顺利通过。 

棘手的部分是正确处理路径语义。 

考虑这个输入：```
3
cd /a/b
cd ..
pwd
```正确的输出是：```
/a/
```粗心的实现可能会删除最后一个字符而不是最后一个目录，并意外地产生`/a/b`。 

另一个常见错误发生在绝对路径上。```
3
cd /a/b
cd /x
pwd
```正确的输出是：```
/x/
```当路径开始时`/`，我们必须完全丢弃旧的当前目录。 如果我们错误地将新路径附加到现有路径上，我们会得到`/a/b/x/`。 

具有混合目录名称和的相对路径`..`也会导致错误：```
2
cd a/b/../c
pwd
```正确的输出是：```
/a/c/
```路径必须按顺序逐个组件进行处理。 我们不能简单地删除所有`..`盲目地，因为每个目录只影响紧邻的前一个目录。 

根目录是另一个边缘情况。```
3
cd /
pwd
cd ..
```输出是：```text`

/

```该语句保证我们永远不会移动到根之上，但我们的实现仍然需要将根正确表示为空路径堆栈或等效结构。 

## 方法

 最直接的想法是将当前目录视为一个字符串，并在每次命令出现时逐字操作它。 

对于一个`cd`，我们可以连接字符串，重复搜索斜杠，看到时手动删除父目录`..`，并重建结果。 这是可行的，因为路径很短。 即使每个命令多次处理 200 个字符的字符串，总工作量仍然很小。 

这种方法的弱点不是性能，而是复杂性。 字符串切片和手动解析很快就会变得容易出错。 处理类似的情况`/`、尾部斜杠或连续的父操作变得很尴尬。 

更清晰的观察是文件系统路径自然地表现得像堆栈。 

例如：```text
/home/vasya/docs
```可以表示为：```
["home", "vasya", "docs"]
```进入目录意味着压入堆栈。 转到父目录意味着从堆栈中弹出。 打印当前路径意味着用斜杠加入堆栈。 

这与 shell 的语义完全匹配。 

当处理一个`cd`命令：

 如果路径开头为`/`，我们重置堆栈，因为绝对路径从根开始。 

然后我们将路径分割为`/`并处理每个组件。 

如果组件为空，我们将忽略它。 这主要是因为绝对路径开头`/`。 

如果该组件是`..`，我们弹出一个目录。 

否则，我们将推送目录名称。 

在这些约束下，暴力字符串操作解决方案是可以接受的，但堆栈表示更简单、更安全，并且直接反映实际的文件系统逻辑。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力字符串操作 | O(n × L²) | O(n × L²) | O(L) | 已接受 |
 | 基于堆栈的模拟| O(n × L) | O(L) | 已接受 |

 这里，`L`是最大路径长度。 

## 算法演练

 1. 将当前目录存储为目录名称列表。 

例如，`/home/vasya/`变成`["home", "vasya"]`。 
2. 一一阅读每条命令。 

shell 状态按顺序更改，因此按顺序处理命令与问题行为完全匹配。 
3.如果命令是`pwd`，打印当前路径。 

将所有目录名称连接起来`/`，在前面添加一个前导斜杠，并在后面添加一个尾部斜杠。 

如果堆栈为空，则结果很简单`/`。 
4. 如果命令是`cd path`，首先判断路径是绝对路径还是相对路径。 

如果路径开头为`/`，清除当前堆栈，因为绝对路径从根开始。 
5. 使用分割路径`/`作为分隔符。 

这会转换类似的东西`vasya/../petya`分解成我们可以独立加工的组件。 
6. 从左到右处理每个组件。 

如果该组件为空，则忽略它。 

绝对路径中的前导斜杠会发生这种情况。 
7. 如果该组件是`..`，从堆栈中删除最后一个目录。 

这模拟移动到父目录。 
8. 否则，将该组件追加到堆栈中。 

这模拟进入子目录。 

### 为什么它有效

 堆栈始终存储从根目录到当前位置的确切目录顺序。 

每个有效的文件系统移动仅更改该序列的末尾。 进入目录会添加一个元素，而移动到父目录会删除一个元素。 绝对路径从根开始重新启动序列。 

由于每个路径组件的处理顺序与 shell 解释它的顺序相同，因此处理命令后的堆栈始终与真实的当前目录匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    
    current = []
    
    for _ in range(n):
        parts = input().strip().split()
        
        if parts[0] == "pwd":
            print("/" + "/".join(current) + "/")
        else:
            path = parts[1]
            
            if path[0] == "/":
                current = []
            
            components = path.split("/")
            
            for comp in components:
                if comp == "" or comp == ".":
                    continue
                
                if comp == "..":
                    current.pop()
                else:
                    current.append(comp)

solve()
```该解决方案将当前路径存储为名为的列表`current`。 每个元素都是一个目录名称。 

为了`pwd`，该实现通过将目录名称与`/`。 表达式：```
"/" + "/".join(current) + "/"
```甚至适用于根目录。 如果`current`是空的，`"".join(current)`变成空字符串，所以最终结果很简单`//`。 由于格式已经包含前导斜杠和尾随斜杠，这实际上会产生`//`，这对于 root 来说是不正确的。 

为了避免这种微妙的错误，许多人更喜欢有条件的方法。 然而，在这个特定的实现中，空连接会产生一个空的中间部分，从而导致准确的结果`//`。 我们应该纠正这一点。 

正确的实施是：```python
if not current:
    print("/")
else:
    print("/" + "/".join(current) + "/")
```这是更正后的最终版本：```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    
    current = []
    
    for _ in range(n):
        parts = input().strip().split()
        
        if parts[0] == "pwd":
            if not current:
                print("/")
            else:
                print("/" + "/".join(current) + "/")
        else:
            path = parts[1]
            
            if path[0] == "/":
                current = []
            
            for comp in path.split("/"):
                if comp == "":
                    continue
                
                if comp == "..":
                    current.pop()
                else:
                    current.append(comp)

solve()
```绝对路径重置是另一个微妙之处。 我们必须在处理组件之前清除堆栈。 如果我们之后清除它，同一路径内的相对导航将表现不正确。 

这个问题保证我们永远不会超越根，所以`current.pop()`总是安全的。 

## 工作示例

 ### 示例 1

 输入：```
7
pwd
cd /home/vasya
pwd
cd ..
pwd
cd vasya/../petya
pwd
```| 命令 | 加工组件| 当前堆栈 | 输出|
 | --- | --- | --- | --- |
 | 密码 | - | []| / |
 | cd /home/vasya | cd /home/vasya | 家, 瓦夏| [家，瓦夏] | - |
 | 密码 | - | [家，瓦夏] | /主页/瓦西亚/ |
 | 光盘.. | ..| [首页] | - |
 | 密码 | - | [首页] | /主页/ |
 | cd 瓦西亚/../petya | 瓦西亚, .., 佩蒂亚 | [家，彼佳] | - |
 | 密码 | - | [家，彼佳] | /home/petya/ |

 该跟踪显示了为什么堆栈模型是自然的。 每个目录条目推送一次，并且每个`..`准确删除最新的目录。 

### 示例 2

 输入：```
6
cd /a/b/c
pwd
cd ../../x
pwd
cd /z
pwd
```| 命令 | 加工组件| 当前堆栈 | 输出|
 | --- | --- | --- | --- |
 | cd /a/b/c| 甲、乙、丙 | [a、b、c] | - |
 | 密码 | - | [a、b、c] | /a/b/c/ |
 | cd ../../x | cd ../../x | .., .., x | [a，x] | - |
 | 密码 | - | [a，x] | /a/x/ |
 | cd /z | z | [z] | - |
 | 密码 | - | [z] | /z/|

 此示例演示了相对路径和绝对路径之间的差异。 命令`../../x`从当前目录开始，同时`/z`完全放弃以前的位置。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n × L) | 每个命令线性地处理其路径 |
 | 空间| O(L) | 堆栈最多存储当前路径下的所有目录 |

 限制非常小，因此该解决方案在时间和内存限制内可以轻松运行。 即使在最坏的情况下，处理的字符总数也只有几千个。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    
    input = sys.stdin.readline
    
    out = io.StringIO()
    sys.stdout = out
    
    current = []
    
    n = int(input())
    
    for _ in range(n):
        parts = input().strip().split()
        
        if parts[0] == "pwd":
            if not current:
                print("/")
            else:
                print("/" + "/".join(current) + "/")
        else:
            path = parts[1]
            
            if path[0] == "/":
                current = []
            
            for comp in path.split("/"):
                if comp == "":
                    continue
                
                if comp == "..":
                    current.pop()
                else:
                    current.append(comp)
    
    sys.stdout = sys.__stdout__
    return out.getvalue()

# provided sample
assert run(
"""7
pwd
cd /home/vasya
pwd
cd ..
pwd
cd vasya/../petya
pwd
"""
) == """/
/home/vasya/
/home/
/home/petya/
"""

# minimum case
assert run(
"""1
pwd
"""
) == """/
"""

# absolute path reset
assert run(
"""4
cd /a/b
cd /x
pwd
pwd
"""
) == """/x/
/x/
"""

# relative navigation
assert run(
"""4
cd /a/b/c
cd ../../d
pwd
pwd
"""
) == """/a/d/
/a/d/
"""

# repeated parent operations
assert run(
"""5
cd /a/b/c
cd ../..
pwd
pwd
"""
) == """/a/
/a/
"""

# mixed navigation
assert run(
"""5
cd /a
cd b/../c
pwd
cd ..
pwd
"""
) == """/a/c/
/a/
"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 pwd`|`/`| 正确处理root |
 |`/a/b`然后`/x`|`/x/`| 绝对路径重置状态 |
 |`../../d`|`/a/d/`| 多父遍历 |
 |`../..`来自深层路径|`/a/`| 连续爆裂|
 |`b/../c`|`/a/c/`| 混合相对导航|

 ## 边缘情况

 考虑当前目录被绝对路径替换的情况。 

输入：```
4
cd /a/b
cd /x/y
pwd
pwd
```执行：

 之后`cd /a/b`，堆栈变成`[a, b]`。 

下一个命令以`/`，因此算法在处理组件之前会清除堆栈。 然后它附加`x`和`y`。 

最终的栈是`[x, y]`，生产：```
/x/y/
```如果我们忘记清除堆栈，我们会错误地得到`/a/b/x/y/`。 

现在考虑重复的父导航。 

输入：```
3
cd /a/b/c
cd ../..
pwd
```第一个命令之后的堆栈是`[a, b, c]`。 

加工`..`持久性有机污染物`c`。 

处理第二个`..`持久性有机污染物`b`。 

剩余的堆栈是`[a]`，所以输出是：```
/a/
```这证实了每个`..`仅影响前一个目录。 

最后，考虑混合相对运动。 

输入：```
2
cd a/b/../c
pwd
```该算法按顺序处理组件：`a`→`[a]`

`b`→`[a, b]`

`..`→`[a]`

`c`→`[a, c]`打印的路径变为：```
/a/c/
```这说明了为什么逐个组件仿真是必要的。 快捷字符串替换方法很容易错误地处理嵌套的父引用。
