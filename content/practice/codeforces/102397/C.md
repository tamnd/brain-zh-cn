---
title: "CF 102397C - 终点"
description: "我们从一个网格点 (x, y) 开始，并接收一个描述一系列单位移动的字符串。 每个字符只更改一个坐标：U 增加 y，D 减少 y，L 减少 x，R 增加 x。"
date: "2026-08-11T05:04:57+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102397
codeforces_index: "C"
codeforces_contest_name: "Asu Coding Cup 4"
rating: 0
weight: 102397
solve_time_s: 226
verified: true
draft: false
---

[CF 102397C - 终点](https://codeforces.com/problemset/problem/102397/C)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从一个网格点开始`(x, y)`并接收描述单元移动序列的字符串。 每个字符只改变一个坐标：`U`增加`y`,`D`减少`y`,`L`减少`x`， 和`R`增加`x`。 

任务只是按照给定的顺序应用每个动作并打印最终的网格点。 在处理完路径的运动后，就不再需要路径本身了。 由于允许答案包含负坐标，因此网格上不需要强制执行边界。 

起始坐标满足`1 <= x, y <= 100`，路径长度最多为`100`。 这些限制非常小，因此即使每个字符只执行少量操作的算法也很容易足够快。 更重要的是，问题的结构为我们提供了一个明显的线性解决方案：每个字符对一个坐标贡献一个独立的变化，因此没有理由重新访问先前的字符或搜索可能的路径。 

粗心的实现仍然可能在一些边界情况下失败。 例如，考虑```
1 1
L
```正确答案是```
0 1
```因为`L`减少`x`一个。 假设坐标必须保持正值的实现可能会错误地拒绝或限制结果。 

另一个例子是```
5 5
DDDDD
```产生```
5 0
```The coordinate is allowed to reach zero, and it could also become negative. 治疗`1`as a lower bound after the walk would produce an incorrect result.

 Moves can also cancel each other. 为了```
3 4
LRUD
```最终位置是```
3 4
```因为`L`和`R`取消于`x`坐标，同时`U`和`D`取消于`y`协调。 只计算移动次数而不考虑其方向的解决方案将丢失此信息。 

## 方法

 A straightforward but unnecessarily expensive approach is to determine the position after every prefix of the path by scanning that prefix from the starting point. 处理完第一个字符后，我们扫描一个字符。 处理完第二个字符后，我们再次扫描两个字符，依此类推。 这是正确的，因为每次扫描都直接模拟相应的前缀，但重复处理相同的动作。 

如果路径有长度`n`，这执行`1 + 2 + 3 + ... + n = n(n + 1)/2`字符操作。 和`n = 100`， 那是`5050`operations, which still easily fits the given limits. Its weakness is conceptual rather than practical for these constraints: it does repeated work that is completely unnecessary.

 The key observation is that the endpoint only depends on the total displacement of each coordinate. 我们可以在保持当前位置的同时处理一次路径。 每当我们看到`U`或者`D`，我们更新`y`; 每当我们看到`L`或者`R`，我们更新`x`。 每个角色仅被消耗一次。 

暴力版本之所以有效，是因为重复模拟前缀最终会给出正确的端点，但它无法利用当前位置已经包含从先前移动中获得的所有信息这一事实。 观察到单个当前坐标对就足够了，我们可以用一次直接遍历来替换重复的前缀扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(1) | O(1) | 接受这些限制，但不必要的重复 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取起始坐标`x`和`y`。 这些值表示发生任何移动之前的位置。 
2.读取路径字符串`s`。 我们将从左到右处理它的字符，因为移动的顺序决定了终点。 
3. 对于每一个角色`s`，精确更新一个坐标。 为了`U`， 增加`y`一个。 为了`D`， 减少`y`一个。 为了`L`， 减少`x`一个。 为了`R`， 增加`x`一个。 其他坐标不应改变，因为每次移动都是水平或垂直移动一个单位。 
4. 处理完所有字符后，打印结果`x`和`y`。 此时，每个运动都将其位移贡献给坐标，因此当前对是自助餐厅的位置。 

### 为什么它有效

 处理完路径的任何前缀后，保持不变式`(x, y)`正是从原始起点执行该前缀后到达的位置。 最初前缀为空，因此不变量为真，因为`(x, y)`是起始位置。 接下来的每个角色都会根据该角色定义的移动来更改当前位置，因此每次迭代后不变式仍然为真。 一旦整个字符串被处理完，前缀就是完整的路径，意思是`(x, y)`正是所需的终点。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    x, y = map(int, input().split())
    s = input().strip()

    for move in s:
        if move == 'U':
            y += 1
        elif move == 'D':
            y -= 1
        elif move == 'L':
            x -= 1
        else:  # move == 'R'
            x += 1

    print(x, y)

if __name__ == "__main__":
    solve()
```第一行直接将起点读入`x`和`y`，匹配运动规则使用的坐标系。 

在迭代之前，路径会被去除其尾随换行符。 然后循环对每个动作精确地检查一次。 这四种情况直接对应于四种可能的变化，因此不需要维护查找表或辅助数据结构。 

没有边界检查，因为该问题明确允许最终坐标为负数。 添加一个条件，例如`if x > 0`向左移动之前会改变问题并可能产生错误的答案。 

Python 中也不存在整数溢出的风险。 即使最大路径长度为`100`，每个坐标最多可以改变`100`从其起始值开始，因此实际值很小。 

## 工作示例

 ### 示例 1

 输入是```
5 3
UUUDLRLRLRR
```开始于`(5, 3)`，按顺序处理每个动作。 

| 步骤| 移动| x| y |
 | ---| ---| ---| ---|
 | 0 | 开始| 5 | 3 |
 | 1 | 你| 5 | 4 |
 | 2 | 你| 5 | 5 |
 | 3 | 你| 5 | 6 |
 | 4 | d | 5 | 5 |
 | 5 | 左 | 4 | 5 |
 | 6 | 右 | 5 | 5 |
 | 7 | 左 | 4 | 5 |
 | 8 | 右 | 5 | 5 |
 | 9 | 左 | 4 | 5 |
 | 10 | 10 右 | 5 | 5 |
 | 11 | 11 右 | 6 | 5 |

 最终的位置是`(6, 5)`，所以输出是```
6 5
```重复的`L`和`R`运动表明该算法不需要对取消进行特殊处理。 每次移动都会改变当前位置，所得坐标自然包含累积的位移。 

### 示例 2

 考虑有效输入```
2 3
LLDDRU
```状态变化如下。 

| 步骤| 移动| x| y |
 | ---| ---| ---| ---|
 | 0 | 开始| 2 | 3 |
 | 1 | 左 | 1 | 3 |
 | 2 | 左 | 0 | 3 |
 | 3 | d | 0 | 2 |
 | 4 | d | 0 | 1 |
 | 5 | 右 | 1 | 1 |
 | 6 | 你| 1 | 2 |

 最终输出是```
1 2
```该轨迹使坐标达到零，然后沿相反方向移回。 该算法不会强加人为的网格边界，因此每个运动都会严格按照指定应用。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 路径的每个字符都被处理一次 |
 | 空间| O(1) | O(1) | 只需要两个坐标和输入字符串 |

 和`n <= 100`，线性遍历最多执行100次运动更新。 它完全在 1.5 秒的时间限制内，并且与 256 MB 的限制相比，使用的内存可以忽略不计。 

## 测试用例```python
import sys
import io

def solve():
    x, y = map(int, input().split())
    s = input().strip()

    for move in s:
        if move == 'U':
            y += 1
        elif move == 'D':
            y -= 1
        elif move == 'L':
            x -= 1
        else:
            x += 1

    print(x, y)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
assert run("5 3\nUUUDLRLRLRR\n") == "6 5", "sample 1"

# Minimum-size input
assert run("1 1\nU\n") == "1 2", "single upward move"

# All moves are equal
assert run("5 5\nLLLLLLLLLL\n") == "-5 5", "ten left moves"

# Boundary and negative coordinate
assert run("1 1\nDDDD\n") == "1 -3", "negative y coordinate"

# Cancellation and order
assert run("100 100\nLRUD\n") == "100 100", "complete cancellation"

# Maximum-size path
assert run("100 100\n" + "R" * 100 + "\n") == "200 100", "maximum path length"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1`和`U`|`1 2`| 最小尺寸路径和单坐标更新|
 |`5 5`与十`L`移动|`-5 5`| 反复运动和消极`x`|
 |`1 1`有四个`D`移动|`1 -3`| 穿越零线以下 |
 |`100 100`和`LRUD`|`100 100`| 精确取消相反的运动|
 |`100 100`与 100`R`移动|`200 100`| 最大路径长度和重复更新|

 ## 边缘情况

 第一种边缘情况是使位置为零或更低的移动。 为了```
1 1
L
```该算法开始于`(1, 1)`, 过程`L`，和变化`x`到`0`。 它打印`0 1`。 行走过程中没有边界限制，因此零坐标有效。 

第二个边缘情况多次超出正起始区域。 为了```
1 1
DDDD
```连续的`y`值是`0`,`-1`,`-2`， 和`-3`。 最终的答案是`1 -3`。 防止坐标变为负值的解决方案会错误地停止应用路径。 

第三种边缘情况是完全取消。 和```
3 4
LRUD
```前两个动作发生变化`x`从`3`到`2`然后回到`3`。 接下来的两个动作发生变化`y`从`4`到`5`然后回到`4`。 最终结果是`3 4`，正是起点。 这证实了不变量跟踪实际的当前位置，而不仅仅是计算移动。 

最后，仅包含一个方向的路径不需要特殊情况。 为了```
100 100
RRRR
```四个`R`操作简单地增加`x`从`100`到`104`，生产`104 100`。 相同的更新规则可以处理单次移动、重复移动和混合路径，这就是为什么在不牺牲正确性的情况下实现仍然很小的原因。
