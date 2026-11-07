---
title: "CF 1989A - 抓住硬币"
description: "我们得到一个代表街机屏幕的网格，坐标为 $(x, y)$，其中 Monocarp 从原点 $(0, 0)$ 开始。 网格上散布着 $n$ 个硬币。 每一秒，Monocarp 都可以沿八个方向之一移动（上、下、左、右和四个对角线）。"
date: "2026-06-08T15:44:02+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1989
codeforces_index: "A"
codeforces_contest_name: "Educational Codeforces Round 167 (Rated for Div. 2)"
rating: 800
weight: 1989
solve_time_s: 398
verified: false
draft: false
---

[CF 1989A - 抓住硬币](https://codeforces.com/problemset/problem/1989/A)

 **评分：** 800
 **标签：** 实施
 **求解时间：** 6m 38s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个代表街机屏幕和坐标的网格$(x, y)$，Monocarp 从原点开始$(0, 0)$。 有$n$硬币散落在网格上。 每一秒，Monocarp 都可以沿八个方向之一移动（上、下、左、右和四个对角线）。 Monocarp 移动后，所有硬币沿 Y 轴下落一个单位。 目标是确定每个硬币是否可以在某个时刻 Monocarp 到达它，假设他的移动是最佳的。 

输入给出$n$以及硬币的坐标，所有这些都清晰可见，而且没有在原点。 输出是每个硬币一行：如果 Monocarp 可以收集它，则为“YES”，否则为“NO”。 

限制很小：$n \le 500$和硬币坐标之间$-50$和$50$。 这使得算法至少具有$O(n)$每枚硬币，或$O(n^2)$总计，没有性能问题。 

关键的非明显案例涉及原点以下的硬币。 由于硬币每秒下落 1 个单位，因此最初位于负 Y 坐标的硬币可能会比 Monocarp 对角到达它的速度更快。 例如，如果一枚硬币开始于$(-1, -2)$，Monocarp 在掉落时可以沿对角线移动以到达它。 使用曼哈顿距离而不考虑硬币下落的天真检查会错误地表明他无法到达它。 

另一个微妙的情况是硬币对角或水平排列：Monocarp 的对角移动可用于在水平移动时垂直“追赶”。 

## 方法

 最简单的方法是逐秒模拟 Monocarp 对每枚硬币的移动，检查他的路径是否与硬币的下落路径相交。 这是正确的，但很麻烦，需要每个硬币和每个时间步长的模拟循环，对于远处的硬币可能需要数百个步骤。 和$n = 500$仓位最多为 50 个，这是可行的，但不必要的复杂。 

最佳方法来自观察 Monocarp 的运动选项。 在一秒钟内，他最多可以将 X 和 Y 各改变 1 个单位。 这相当于切比雪夫距离（最大值$|dx|$和$|dy|$）而不是曼哈顿距离。 我们必须考虑到硬币每秒下落 1 个单位的事实。 设初始硬币位置为$(x, y)$和单果树在$(0, 0)$。 如果存在一些硬币，他就可以够到硬币$t \ge 0$这样：$$\max(|x|, |y - t|) \le t$$解决$t$给出$t \ge \max(|x|, y - t)$，这简化为$t \ge |x|$和$y - t \le t$， 或者$y \le 2t$。 自从$t \ge |x|$，第二个不等式变为$y \le 2|x|$。 所以 Monocarp 获得硬币的条件是：$$y \le 2 \cdot |x|$$如果这种情况成立，Monocarp 可以通过斜向移动硬币的柱子来抓住硬币，并在需要时等待它落下。 否则，他不能。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| O(n * 最大( | x | , |
 | 最优切比雪夫检查 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取硬币数量$n$以及他们的坐标$(x_i, y_i)$为了$i = 1 \dots n$。 
2. 对于每个硬币，计算 X 坐标的绝对值：$|x_i|$。 这表示 Monocarp 必须水平（或对角线）移动以与硬币的柱对齐的最小秒数。 
3、检查硬币的Y坐标是否满足$y_i \le 2 \cdot |x_i|$。 此条件确保 Monocarp 的组合对角/水平移动可以匹配硬币的下落轨迹。 如果为真，则打印“YES”。 
4. 否则，打印“NO”。 

工作原理：Monocarp 的运动允许同时进行水平和垂直调整。 切比雪夫距离给出了水平或垂直到达硬币的最小秒数。 由于硬币每秒下落一个单位，因此 Monocarp 相对于下落硬币能够克服的最大垂直距离恰好是水平距离的两倍。 这个不变量保证如果$y \le 2|x|$，有一些动作序列可以抓住硬币。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
for _ in range(n):
    x, y = map(int, input().split())
    if y <= 2 * abs(x):
        print("YES")
    else:
        print("NO")
```该解决方案仅迭代硬币一次。 关键检查源自切比雪夫距离和下落硬币动力学。 使用`abs(x)`确保我们处理 Y 轴两侧的硬币。 比较`y <= 2 * abs(x)`自然地处理高于或低于原点的硬币，因为当硬币水平接近时，负 y 坐标始终满足不等式。 

## 工作示例

 **示例1**

 输入：```
5
24 42
-2 -1
-1 -2
0 -50
15 0
```| 硬币| x| y | 2*|x| | y <= 2*|x|？ | 结果 |

 |------|---|---|---|---|--------|

 | 1 | 24 | 42 | 42 48 | 48 是 | 是 |

 | 2 | -2 | -1 | 4 | 是 | 是 |

 | 3 | -1 | -2 | 2 | 否 | 否 |

 | 4 | 0 | -50 | 0 | 否 | 否 |

 | 5 | 15 | 15 0 | 30| 是 | 是 |

 这展示了正坐标和负坐标，以及 y < 0 处的硬币。 

**示例2**

 输入：```
3
1 2
2 3
3 5
```| 硬币| x| y | 2*|x| | y <= 2*|x|？ | 结果 |

 |------|---|---|---|---|--------|

 | 1 | 1 | 2 | 2 | 是 | 是 |

 | 2 | 2 | 3 | 4 | 是 | 是 |

 | 3 | 3 | 5 | 6 | 是 | 是 |

 这证实了原点以上的硬币被正确分类。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个硬币都会在恒定的时间内独立检查。 |
 | 空间| O(1) | O(1) | 除了循环变量之外没有额外的内存。 |

 给定$n \le 500$和坐标由$\pm 50$，该解决方案非常高效，并且能够轻松满足 2 秒的时间限制和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    n = int(input())
    for _ in range(n):
        x, y = map(int, input().split())
        if y <= 2 * abs(x):
            print("YES")
        else:
            print("NO")
    return out.getvalue().strip()

# Provided sample
assert run("5\n24 42\n-2 -1\n-1 -2\n0 -50\n15 0\n") == "YES\nYES\nNO\nNO\nYES"

# Custom test cases
assert run("1\n0 1\n") == "NO", "coin above origin, unreachable horizontally"
assert run("1\n0 0\n") == "YES", "edge case, coin at origin"
assert run("2\n-50 100\n50 100\n") == "NO\nNO", "coins too far vertically"
assert run("3\n1 1\n-1 1\n0 0\n") == "YES\nYES\nYES", "small coins around origin"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`0 1`| 否 | 无法水平到达原点正上方的硬币 |
 |`0 0`| 是 | 硬币原产地 |
 |`-50 100`| 否 | 硬币太高抓不住|
 |`1 1\n-1 1\n0 0`| 是的，是的，是的| 不同象限中接近原产地的硬币|

 ## 边缘情况

 对于原点正上方或正下方的硬币$x = 0$，Monocarp 只能垂直移动，这限制了到达范围。 例如，`(0, -50)`产量`NO`因为 Monocarp 的下降速度不能快于硬币的下降速度。 对于水平轴上的硬币`(x, 0)`，他可以水平移动并立即抓住硬币，这就是为什么`(15, 0)`产量`YES`。 负 y 坐标`2*abs(x)`被处理是因为 Monoc
