---
title: "CF 78B - 复活节彩蛋"
description: "我们需要为 n 个鸡蛋构建一个颜色循环序列。 总共有七种可用颜色：R、O、Y、G、B、I、V 必须同时满足两个条件。 首先，每种颜色必须至少出现一次。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "implementation"]
categories: ["algorithms"]
codeforces_contest: 78
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 70 (Div. 2)"
rating: 1200
weight: 78
solve_time_s: 119
verified: false
draft: false
---

[CF 78B - 复活节彩蛋](https://codeforces.com/problemset/problem/78/B)

 **评分：** 1200
 **标签：** 构造性算法，实现
 **求解时间：** 1m 59s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们需要建立一个颜色的循环序列`n`鸡蛋。 总共有七种可用颜色：`R, O, Y, G, B, I, V`两个条件必须同时成立。 

首先，每种颜色必须至少出现一次。 

其次，圆圈上的每四个连续鸡蛋块必须包含四种不同的颜色。 由于鸡蛋形成一个圆圈，因此序列会环绕。 最后的鸡蛋和最先的鸡蛋也是邻居。 

输入只是一个整数`n`，鸡蛋的数量。 输出是任意长度的有效着色字符串`n`。 

限制非常小。`n`至多是`100`，因此即使效率相当低的方法也能在时间限制内顺利运行。 对于如此小的限制，对所有颜色分配的强力回溯解决方案理论上是可能的，但分支因子仍然足够大，以至于变得混乱且不必要。 这个问题实际上是有建设性的，有一个简单的模式总是有效的。 

棘手的部分是圆形条件。 线性工作的序列在回绕后可能会失败。 例如：```
ROYGBIVR
```如果仅从左到右检查，看起来不错，但最后三个字符加上第一个字符形成：```
IVRR
```重复`R`。 

另一个常见的错误是使用所有七种颜色一次，然后从头开始重复：```
ROYGBIVROY...
```此操作会失败，因为某些四个窗口在连接点附近包含重复的颜色。 

例如，与`n = 8`：```
ROYGBIVR
```跨越边界的四个连续鸡蛋是：```
V R R O
```二`R`出现。 

关键的观察结果是，我们实际上并不需要每个本地窗口中都有所有七种颜色。 我们只需要每组四个连续的鸡蛋是两两不同的。 精心选择的重复后缀可以无限期地满足该条件。 

## 方法

 强力解决方案将尝试为每个鸡蛋分配七种颜色中的一种，同时检查当前的部分序列是否违反“四个连续不同”规则。 最后，它还将验证是否使用了所有七种颜色以及圆形环绕窗口是否有效。 

这是可行的，因为约束很小，但搜索空间仍然是指数级的。 在最坏的情况下，我们粗略地探索`7^n`可能性，即使对于中等程度的人来说也是天文数字`n`。 修剪是有帮助的，但对于一个有建设性的问题来说，这种方法仍然不必要地复杂。 

真正的见解来自于研究连续四个鸡蛋的状况。 如果我们已经有一个有效的重复模式，其中每个相邻的四个块都包含不同的字母，那么重复该模式永远保持有效。 

标准彩虹序列：```
ROYGBIV
```已经满足条件了。 当我们继续从头开始重复时，问题就会出现，因为圆形重叠会引入重复项。 

我们不重复整个七个字母的模式，而是只重复一个保持四个不同属性的后缀。 顺序：```
GBIV
```可以永远重复，因为该重复内的每个连续的四个块正是不同字母的某种旋转。 

所以构造就变成了：

 1. 开始于`"ROYGBIV"`以保证所有七种颜色都出现。 
2. 对于每个额外位置，循环附加字符`"GBIV"`。 

示例`n = 10`：```
ROYGBIVGBI
```每四个连续字符保持不同，包括跨越圆形边界。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(7^n) | O(7^n) | O(n) | 概念上太慢|
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 创建基本字符串：```
ROYGBIV
```这立即保证了每种颜色至少出现一次。 

1. 计算需要多少个附加字符。```
extra = n - 7
```1. 使用重复模式：```
GBIV
```选择这种模式是因为重复副本中的每个连续的四个字符块都保持不同。 

1. 附加字符来自`"GBIV"`循环往复，直到总长度变为`n`。 

如果`extra = 5`，我们附加：```
GBIVG
```1. 打印最终的字符串。 

### 为什么它有效

 前七个字符恰好包含所有七种颜色一次，因此立即满足第一个条件。 

重复后缀`"GBIV"`长度为四，并且所有四个字符都是不同的。 此模式的任何四个内部重复副本的连续块只是这四个字母的循环移位，因此不会出现重复。 

之间的边界`"ROYGBIV"`并且附加的后缀也有效，因为基数的最后几个字符已经自然地与`"GBIV"`。 

因此，四个连续鸡蛋的每个圆形窗口都包含四种不同的颜色。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    
    base = "ROYGBIV"
    extra_pattern = "GBIV"
    
    ans = base
    
    for i in range(n - 7):
        ans += extra_pattern[i % 4]
    
    print(ans)

solve()
```该解决方案从强制的七色序列开始。 该部分已修复，因为该问题要求每种颜色至少出现一次。 

剩余的位置使用填充`"GBIV"`循环地。 模运算处理该四字符模式内的换行。 

一个微妙的细节是我们仅在前七个字符之后附加。 重复整个七个字母的彩虹会打破边界附近的圆形条件。 

另一个重要的细节是答案长度必须准确无误`n`。 由于循环运行`n - 7`有时，最终长度是正确的，无需额外检查。 

## 工作示例

 ### 示例 1

 输入：```
8
```施工步骤：

 | 步骤| 当前答案 | 添加角色 |
 | ---| ---| ---|
 | 初始| 罗伊比夫 | - |
 | 1 | 罗伊比维格 | G |

 最终输出：```
ROYGBIVG
```此示例显示了必须附加额外字符的最小情况。 所添加的`G`延续安全的重复结构，不会破坏任何四字符窗口。 

### 示例 2

 输入：```
12
```施工步骤：

 | 步骤| 当前答案 | 添加角色 |
 | ---| ---| ---|
 | 初始| 罗伊比夫 | - |
 | 1 | 罗伊比维格 | G |
 | 2 | ROYGBIVGB | 乙|
 | 3 | 罗伊吉比吉 | 我|
 | 4 | 罗伊GBIVGBIV | V |
 | 5 | 罗伊GBIVGBIVG | G |

 最终输出：```
ROYGBIVGBIVG
```该轨迹表明了循环重复`"GBIV"`。 每组四个连续字符保持不同，因为后缀本身是不同字母的四个字符循环。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 我们准确地附加`n`整体人物|
 | 空间| O(n) | 输出字符串存储`n`人物 |

 和`n ≤ 100`，这个解决方案很容易在时间和内存限制内。 该实现仅执行简单的字符串操作和单个循环。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    n = int(input())
    
    base = "ROYGBIV"
    extra_pattern = "GBIV"
    
    ans = base
    
    for i in range(n - 7):
        ans += extra_pattern[i % 4]
    
    print(ans)

def run(inp: str) -> str:
    global input
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline
    
    out = io.StringIO()
    backup = sys.stdout
    sys.stdout = out
    
    solve()
    
    sys.stdout = backup
    return out.getvalue().strip()

# provided sample
assert run("8\n") == "ROYGBIVG", "sample 1"

# minimum size
assert run("7\n") == "ROYGBIV", "minimum n"

# one full extra cycle
assert run("11\n") == "ROYGBIVGBIV", "full GBIV repetition"

# off-by-one after cycle restart
assert run("12\n") == "ROYGBIVGBIVG", "cycle restart"

# maximum size length check
res = run("100\n")
assert len(res) == 100, "maximum size"

# all colors appear
for c in "ROYGBIV":
    assert c in res, "missing color"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`7`|`ROYGBIV`| 最小有效尺寸 |
 |`8`|`ROYGBIVG`| 第一个附加字符 |
 |`11`|`ROYGBIVGBIV`| 精确的完整后缀循环 |
 |`12`|`ROYGBIVGBIVG`| 正确的模数重启 |
 |`100`| 长度 100 有效字符串 | 最大约束|

 ## 边缘情况

 考虑最小输入：```
7
```该算法输出：```
ROYGBIV
```每种颜色都会出现一次，并且每组四个连续的鸡蛋都包含不同的颜色，因为所有角色都是独一无二的。 

现在考虑第一个重要的扩展：```
8
```构造变为：```
ROYGBIVG
```检查圆形窗口：```
ROYG
OYGB
YGBI
GBIV
BIVG
IVGR
VGRO
GROY
```所有四字符窗口都包含不同的字母。 

天真的重复，例如：```
ROYGBIVR
```会失败，因为圆形窗口：```
IVRR
```包含重复的`R`。 

另一个微妙的情况是附加模式环绕时：```
12
```输出：```
ROYGBIVGBIVG
```后缀重复如下：```
GBIVG
```即使重新启动后`G`，每个四个连续字符的块仍然是一个排列`G, B, I, V`，因此条件继续成立。
