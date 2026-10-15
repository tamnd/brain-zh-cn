---
title: "CF 106113A - 人形机器人之路"
description: "人形机器人从 2D 平面上的坐标 (0, 0) 开始并执行一系列运动。 命令字符串中的每个字符代表一次移动：F 使机器人向上移动，y 增加 1。B 使机器人向下移动，y 减少 1。"
date: "2026-06-25T11:37:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106113
codeforces_index: "A"
codeforces_contest_name: "Coding Cup TecNM 2025"
rating: 0
weight: 106113
solve_time_s: 34
verified: true
draft: false
---

[CF 106113A - 人形机器人之路](https://codeforces.com/problemset/problem/106113/A)

 **评级：** -
 **标签：** -
 **求解时间：** 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 人形机器人从坐标开始`(0, 0)`在 2D 平面上并执行一系列运动。 

命令字符串中的每个字符代表一次移动：`F`向上移动机器人，增加`y`1.`B`向下移动机器人，减少`y`1.`L`将机器人向左移动，减少`x`1.`R`向右移动机器人，增加`x`1.

 处理完所有命令后，我们只关心最终的水平位置。 如果最终`x`坐标为负，我们打印`"Izquierda"`。 如果是正数，我们打印`"Derecha"`。 如果它恰好为零，我们打印`"Linea Recta"`。 

输入尺寸很小。 移动次数最多为 1000，因此即使是简单的模拟也足够快了。 在最坏的情况下，单次遍历字符串仅执行 1000 次操作。 

错误的主要原因是注意了错误的坐标。 仅垂直移动变化`y`，但输出完全取决于`x`。 

考虑输入：```
5
FFFFF
```机器人结束于`(0, 5)`。 正确的输出是：```
Linea Recta
```尝试使用两个坐标对最终位置进行分类的粗心解决方案可能会错误地得出机器人移动到某处的结论，并且不应将其视为在直线上。 

另一个容易犯的错误是忘记左右运动可以相互抵消。```
4
LRLR
```最终的水平位置为`0`，所以答案是：```
Linea Recta
```只需检查是否`L`或者`R`出现在字符串中会给出错误的结果。 

当根本没有水平移动时，就会出现第三种边缘情况。```
3
FBF
```机器人完成于`x = 0`，与垂直位移无关。 答案依然是：```
Linea Recta
```## 方法

 最直接的解决方案是完全按照描述来模拟机器人。 开始于`x = 0`和`y = 0`，处理每个角色，并根据运动规则更新坐标。 处理完所有命令后，检查最终值`x`并打印相应的单词。 

由于最多有 1000 个命令，因此该模拟仅执行 1000 个更新。 这实际上是瞬时的。 

一个更紧凑的观察是，最终答案仅取决于数量之间的差异`R`命令和数量`L`命令。 垂直变动永远不会影响决策。 我们可以直接计算左右移动，而不是维护两个坐标。 

两种观点都得出相同的线性时间解决方案。 模拟版本准确地反映了问题陈述并且易于验证。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| O(N) | O(1) | O(1) | 已接受 |
 | 计算向左/向右移动 | O(N) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 阅读`N`，命令的数量。 
2. 读取命令字符串。 
3. 初始化`x = 0`。 
4. 处理字符串中的每个字符。 

如果角色是`L`, 递减`x`。 

如果角色是`R`, 增量`x`。 

人物`F`和`B`不影响水平位置，因此可以忽略。 
5. 处理完整个字符串后，检查`x`。 
6.如果`x < 0`， 打印`"Izquierda"`。 
7.如果`x > 0`， 打印`"Derecha"`。 
8. 否则打印`"Linea Recta"`。 

### 为什么它有效

 水平坐标从零开始。 每一个`L`将其减一，并且每`R`将其增加一。 没有其他命令更改`x`。 所有命令处理完毕后，最终值`x`正是机器人相对于原点的水平位移。 该语句仅根据该值的符号定义输出，因此检查是否`x`负数、正数或零都会产生所需的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
s = input().strip()

x = 0

for c in s:
    if c == 'L':
        x -= 1
    elif c == 'R':
        x += 1

if x < 0:
    print("Izquierda")
elif x > 0:
    print("Derecha")
else:
    print("Linea Recta")
```该实现仅保留水平坐标，因为垂直坐标永远不会影响输出。 

在循环内部，仅`L`和`R`修改状态。 忽略`F`和`B`是完全安全的，因为它们只会改变`y`。 

最后的条件遵循语句所要求的确切顺序。 首先检查阴性和阳性病例，剩下的可能性为`x = 0`，对应于`"Linea Recta"`。 

## 工作示例

 ### 示例 1

 输入：```
5
FFLRF
```| 步骤| 命令 | x|
 | ---| ---| ---|
 | 开始| - | 0 |
 | 1 | F | 0 |
 | 2 | F | 0 |
 | 3 | 左 | -1 |
 | 4 | 右 | 0 |
 | 5 | F | 0 |

 最终的`x = 0`。 

输出：```
Linea Recta
```这个例子表明垂直运动并不重要。 只有左右移动才能得出答案。 

### 示例 2

 输入：```
8
FRFRLLBL
```| 步骤| 命令 | x|
 | ---| ---| ---|
 | 开始| - | 0 |
 | 1 | F | 0 |
 | 2 | 右 | 1 |
 | 3 | F | 1 |
 | 4 | 右 | 2 |
 | 5 | 左 | 1 |
 | 6 | 左 | 0 |
 | 7 | 乙| 0 |
 | 8 | 左 | -1 |

 最终的`x = -1`。 

输出：```
Izquierda
```该迹线表明，答案取决于净水平位移而不是移动总数。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N) | 一次通过命令字符串 |
 | 空间| O(1) | O(1) | 只存储了几个整型变量 |

 和`N ≤ 1000`，在限制内执行线性扫描是微不足道的。 无论输入大小如何，内存使用量都保持不变。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    n = int(input())
    s = input().strip()

    x = 0
    for c in s:
        if c == 'L':
            x -= 1
        elif c == 'R':
            x += 1

    if x < 0:
        return "Izquierda\n"
    elif x > 0:
        return "Derecha\n"
    else:
        return "Linea Recta\n"

# provided samples
assert run("5\nFFLRF\n") == "Linea Recta\n", "sample 1"
assert run("4\nFFRR\n") == "Derecha\n", "sample 2"
assert run("8\nFRFRLLBL\n") == "Izquierda\n", "sample 3"

# custom cases
assert run("1\nL\n") == "Izquierda\n", "single left move"
assert run("1\nR\n") == "Derecha\n", "single right move"
assert run("4\nLRLR\n") == "Linea Recta\n", "cancelling moves"
assert run("3\nFBF\n") == "Linea Recta\n", "only vertical moves"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / L`|`Izquierda`| 最小尺寸，负位移|
 |`1 / R`|`Derecha`| 最小尺寸，正排量|
 |`LRLR`|`Linea Recta`| 左右移动完全取消|
 |`FBF`|`Linea Recta`| 垂直移动不得影响答案 |

 ## 边缘情况

 考虑所有移动都是垂直的情况：```
3
FBF
```该算法开始于`x = 0`。 每个字符要么是`F`或者`B`， 所以`x`永远不会改变。 循环结束后，`x`保持为零并且算法打印：```
Linea Recta
```这是正确的，因为机器人从未向左或向右移动。 

现在考虑取消水平移动：```
4
LRLR
```更新内容是：`0 → -1 → 0 → -1 → 0`最终值为零，因此输出为：```
Linea Recta
```即使发生水平移动，净位移为零，这正是问题要求我们评估的。 

最后，考虑强负位移：```
5
LLLLF
```水平坐标演变为：`0 → -1 → -2 → -3 → -4`决赛`F`没有改变`x`。 自从`x = -4`，算法打印：```
Izquierda
```这证实了水平移动之后的垂直移动不会改变分类。
