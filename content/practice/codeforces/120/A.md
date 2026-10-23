---
title: "CF 120A - 电梯"
description: "我们获得了关于一个人乘坐电梯的两条信息。 第一个输入告诉我们该人曾经进入哪扇门，是前门还是后门。 第二个输入告诉我们该人正在握住哪根铁轨，铁轨 1 或铁轨 2。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 120
codeforces_index: "A"
codeforces_contest_name: "School Regional Team Contest, Saratov, 2011"
rating: 1000
weight: 120
solve_time_s: 86
verified: true
draft: false
---

[CF 120A - 电梯](https://codeforces.com/problemset/problem/120/A)

 **评分：** 1000
 **标签：** 蛮力、实现、数学
 **求解时间：** 1m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们获得了关于一个人乘坐电梯的两条信息。 

第一个输入告诉我们该人曾经进入哪扇门，是前门还是后门。 第二个输入告诉我们该人正在握住哪根铁轨，铁轨 1 或铁轨 2。 

电梯是对称的，但“左”和“右”的含义根据人从哪一侧进入而变化。 从前门进入时，轨道 1 在左侧；从后门进入时，轨道 1 在右侧。 由于人们用更强的手握住栏杆，因此我们必须确定贵宾是左撇子还是右手。 

限制非常小。 只有四种可能的输入组合：

 - 前部 + 导轨 1
 - 前部 + 导轨 2
 - 靠背 + 导轨 1
 - 靠背 + 导轨 2

 任何恒定时间解决方案都足够快。 即使对所有可能性进行强力查找也很容易满足限制。 

主要的困难不是性能，而是避免电梯方向的混乱。 粗心的实现可能会假设轨道编号始终对应于同一物理侧，这是错误的，因为从对面的门进入时视角会发生变化。 

此输入会发生一个简单的错误：```
back
1
```正确答案是：```
R
```从后面进入的人会看到轨道 1 在其右侧，而不是左侧。 始终将轨道 1 映射到左手的解决方案将错误地打印`L`。 

另一个棘手的情况是：```
front
2
```正确答案是：```
R
```从前入口看，2 号轨道位于骑手的右侧。 忘记根据轨道编号在左右之间切换会产生错误的结果。 

## 方法

 暴力方法是手动编码每个可能的配置。 由于只有四种情况，我们可以直接为每种情况编写条件语句。 

例如：

-`front + 1 -> L`-`front + 2 -> R`-`back + 1 -> R`-`back + 2 -> L`这是可行的，因为输入空间很小。 时间复杂度是恒定的，因为我们只评估一些比较。 

尽管暴力解决方案已经被接受，但我们可以通过观察案例背后的模式来进一步简化逻辑。 

从前面进入时，轨道编号直接与侧面匹配：

 - 导轨 1 表示左手
 - 导轨 2 表示右手

 从后面进入时，方向相反：

 - 轨道 1 变为右侧轨道
 - 轨道 2 变为左手

 关键的观察结果是，答案取决于从骑手当前的角度来看，轨道是出现在骑手的左侧还是右侧。 入口方向完全决定了映射是正向还是反向。 

这让我们可以将问题简化为一个简单的条件结构，而不是单独处理所有四种组合。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(1) | O(1) | O(1) | O(1) | 已接受 |
 | 最佳 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 将入口门视为字符串。 

该值是`"front"`或者`"back"`。 
2. 读取导轨编号。 

该值是`1`或者`2`。 
3. 如果此人从前门进入，请正常解读栏杆。 

Rail 1 在左侧，因此打印`L`。 

Rail 2 在右侧，因此打印`R`。 
4. 如果此人是从后门进入的，则相反的解释。 

Rail 1 现在位于右侧，因此打印`R`。 

Rail 2 现在位于左侧，因此打印`L`。 

### 为什么它有效

 电梯的几何形状是固定的，但乘客的视角会根据他们使用的入口而变化。 从相对两侧进入交换了左和右的含义。 

该算法正确地模拟了这种视角变化。 对于前门，轨道编号与自然的从左到右的顺序相匹配。 对于后门，顺序相反。 由于骑乘者总是用较强的手握住铁轨，因此识别铁轨的一侧可以直接识别骑乘者是左撇子还是右撇子。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

door = input().strip()
rail = int(input())

if door == "front":
    if rail == 1:
        print("L")
    else:
        print("R")
else:
    if rail == 1:
        print("R")
    else:
        print("L")
```该程序首先读取入口方向和轨道编号。 

第一个条件将骑手的两种可能的观点分开。 在每个分支内，轨道编号决定轨道位于骑手的左侧还是右侧。 

实现保持明确，而不是将所有内容压缩到单个表达式中。 对于像这样的小实施问题，清晰比聪明更有价值。 

这`.strip()`调用很重要，因为输入行包含尾随换行符。 在不删除它的情况下，比较例如`door == "front"`会失败的。 

由于输入域非常小，因此不存在边界问题或溢出问题。 

## 工作示例

 ### 示例 1

 输入：```
front
1
```| 步骤| 门| 铁路 | 解读| 输出|
 | ---| ---| ---| ---| ---|
 | 读取输入| 前面| 1 | 正门保持方向 | |
 | 确定边 | 前面| 1 | 导轨 1 位于左侧 | 左 |

 最终输出：```
L
```此示例演示了正常方向的情况。 从前面进入意味着轨道编号遵循自然的从左到右的布局。 

### 示例 2

 输入：```
back
1
```| 步骤| 门| 铁路 | 解读| 输出|
 | ---| ---| ---| ---| ---|
 | 读取输入| 返回 | 1 | 后门反转方向 | |
 | 确定边 | 返回 | 1 | 轨道 1 变为右侧 | 右 |

 最终输出：```
R
```这个例子展示了批判视角的逆转。 相同的轨道编号对应于相反的手，因为骑手是从相反的一侧进入的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(1) | O(1) | 仅进行了一些比较|
 | 空间| O(1) | O(1) | 没有使用额外的数据结构 |

 该解决方案很容易满足限制，因为无论输入如何，它都会持续工作。 由于仅存储两个变量，因此内存使用量也是恒定的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    door = input().strip()
    rail = int(input())

    if door == "front":
        if rail == 1:
            print("L")
        else:
            print("R")
    else:
        if rail == 1:
            print("R")
        else:
            print("L")

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    output = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return output

# provided sample
assert run("front\n1\n") == "L\n", "sample 1"

# custom cases
assert run("front\n2\n") == "R\n", "front entrance, right rail"
assert run("back\n1\n") == "R\n", "back entrance reverses orientation"
assert run("back\n2\n") == "L\n", "back entrance with second rail"
assert run("front\n1\n") == "L\n", "minimum valid configuration"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`front 2`|`R`| 正门入口的正确绘制 |
 |`back 1`|`R`| 视角反转处理 |
 |`back 2`|`L`| 第二根导轨的反向方向 |
 |`front 1`|`L`| 基本左侧映射 |

 ## 边缘情况

 考虑这个输入：```
back
1
```算法输入`"back"`分支。 在该分支内，轨道 1 映射到右侧，因为乘客面对的方向与前门相反。 

执行轨迹：

 -`door = "back"`-`rail = 1`- 输入后门逻辑
 - 导轨 1 对应右手
 - 打印`R`输出是：```
R
```此案例捕获了忘记反转后门方向的解决方案。 

现在考虑：```
front
2
```执行轨迹：

 -`door = "front"`-`rail = 2`- 输入前门逻辑
 - 导轨 2 对应右手
 - 打印`R`输出是：```
R
```此案例验证了法线方向映射是否已正确处理。 

最后，考虑：```
back
2
```执行轨迹：

 -`door = "back"`-`rail = 2`- 输入后门逻辑
 - 导轨 2 对应于左手
 - 打印`L`输出是：```
L
```这证实了入口方向和轨道编号都被正确地一起处理，而不是单独处理。
