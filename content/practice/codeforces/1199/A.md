---
title: "CF 1199A - 城市日"
description: "我们得到了夏季每日降雨量的序列，我们需要找到“不太下雨的最早一天”。"
date: "2026-06-11T23:55:57+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1199
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 576 (Div. 2)"
rating: 1000
weight: 1199
solve_time_s: 85
verified: true
draft: false
---

[CF 1199A - 城市日](https://codeforces.com/problemset/problem/1199/A)

 **评分：** 1000
 **标签：** 实施
 **求解时间：** 1m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了夏季每日降雨量的序列，我们需要找到“不太下雨”的最早一天。 如果与前一天相比，这一天被认为不是那么下雨`x`几天和接下来的日子`y`天（夏季期间），它的降雨量比所有天数都少。 输入包括`n`天，与`x`回顾和回顾的日子`y`展望未来的日子，然后是`n`代表降雨量的不同整数。 输出是满足该条件的第一天的索引。 

因为`n`最多可达 100,000 个，并且公民最多只能观看前后 7 天，任何在大窗口中将每一天与所有其他日期进行比较的解决方案都是低效的。 天真的暴力会检查`x + y`每天最多执行 100,000 * 14 = 1,400,000 次操作。 对于现代 CPU 来说这已经足够小了，所以即使是简单的解决方案也可以工作。 主要的微妙之处在于正确处理边界：首先`x`天，我们无法检查`x`几天前； 最后`y`天，我们无法检查`y`天后。 此外，由于所有降雨量都是不同的，严格的不平等是安全的，我们不需要处理联系。 

粗心的做法可能会忘记将范围限制在`1`到`n`。 例如，如果`x = 2`我们正在考虑一天`1`，我们不能看天数`-1`或者`0`。 如果简单地实现，访问负索引可能会产生不正确的结果或运行时错误。 另一个微妙之处是我们必须返回最早的一天，因此如果多天满足条件，我们必须选择索引最小的那一天。 

## 方法

 蛮力方法很简单：迭代每一天，检查当天的降雨量`x`前几天和`y`接下来的几天，并确定当前日期是否严格小于此窗口中的所有邻居。 这是正确的，因为它直接实现了“不太下雨”的定义，但如果`x`和`y`很大。 这里，`x`和`y`以 7 为界，因此直接比较也是可以接受的。 

稍微干净一点的方法的关键见解是，因为`x`和`y`非常小，我们不需要任何高级数据结构，如线段树或双端队列。 我们可以简单地从一天开始迭代`1`今天`n`并每天检查其左右小窗户。 一旦我们找到所有邻居都更大的一天，我们就可以立即返回它。 这利用了“最早一天”标准允许线性扫描的事实。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解（检查邻居）| O(n * (x + y)) | O(n * (x + y)) | O(n) | 已接受 |
 | 优化（同样的逻辑，提前退出）| O(n * (x + y)) | O(n * (x + y)) | O(n) | 已接受 |

 实际上，考虑到较小的情况，两者都是可以接受的`x`和`y`。 

## 算法演练

 1. 阅读`n`,`x`， 和`y`，然后读取数组`a`的降雨量。 
2. 迭代每天的索引`d`从`1`到`n`。 
3.每一天`d`，检查之前的所有天数`max(1, d - x)`最多`d - 1`。 如果其中任何一个的降雨量小于或等于`a[d]`，那么日`d`不可能不下雨，所以跳到第二天。 
4. 检查所有接下来的日子`d + 1`最多`min(n, d + y)`。 如果其中任何一个的降雨量小于或等于`a[d]`，那么日`d`被取消资格。 
5. 如果两项检查均通过，则打印`d`并终止，因为这是最早的不那么下雨的日子。 

为什么有效：该算法明确地将当前日期与公民感兴趣的日期进行比较，尊重边界。 由于所有值都是不同的，因此严格比较可确保正确评估条件。 线性迭代可确保返回第一个有效日。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, x, y = map(int, input().split())
a = list(map(int, input().split()))

for i in range(n):
    is_valid = True
    for j in range(max(0, i - x), i):
        if a[j] <= a[i]:
            is_valid = False
            break
    if not is_valid:
        continue
    for j in range(i + 1, min(n, i + y + 1)):
        if a[j] <= a[i]:
            is_valid = False
            break
    if is_valid:
        print(i + 1)
        break
```该代码从第一天迭代到最后一天。 每天，它都会使用以下命令检查左右窗口`max`和`min`以确保我们不会越界。 打印通过两项检查的第一天。 这`+1`在问题陈述中考虑从 1 开始的索引。 

## 工作示例

 ### 示例 1

 输入：`10 2 2`，降雨量：`10 9 6 7 8 3 2 1 4 5`| 第 (i) 天 | 左窗| 右窗 | 一个[我] | 检查结果 |
 | ---| ---| ---| ---| ---|
 | 1 | - | 9,6 | 10 | 10 10 > 9？ 是的，10 > 6？ 是的 |
 | 2 | 10 | 10 6,7 | 9 | 9 < 10？ 是的，9 < 6？ 没有 |
 | 3 | 10,9 | 10,9 7,8 | 7,8 6 | 6 < 10 & 6 < 9？ 是的，6 < 7 & 6 < 8？ 是的 |

 该算法在第 3 天停止并打印`3`。 

### 示例 2

 输入：`10 2 2`，降雨量：`10 9 6 7 8 3 2 1 4 5`但检查第8天

 跟踪显示第 8 天已离开邻居`3,2`和正确的邻居`4,5`。`1 < 3,2? Yes`,`1 < 4,5? Yes`，确认这是一个有效的不太下雨的日子。 只有在前几天失败后才能找到第 8 天。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n * (x + y)) | O(n * (x + y)) | n 天中的每一天最多检查 x + y 个邻居，x,y <= 7，因此常数因子 |
 | 空间| O(n) | 存储降雨量数组 |

 给定`n`最多 10^5 且 x+y <= 14，总操作量约为 140 万次，运行时间在 1 秒以下。 内存使用量呈线性关系`n`，远低于 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # solution code
    n, x, y = map(int, input().split())
    a = list(map(int, input().split()))
    for i in range(n):
        is_valid = True
        for j in range(max(0, i - x), i):
            if a[j] <= a[i]:
                is_valid = False
                break
        if not is_valid:
            continue
        for j in range(i + 1, min(n, i + y + 1)):
            if a[j] <= a[i]:
                is_valid = False
                break
        if is_valid:
            print(i + 1)
            break
    return output.getvalue().strip()

# Provided samples
assert run("10 2 2\n10 9 6 7 8 3 2 1 4 5\n") == "3", "sample 1"
# Minimum size input
assert run("1 0 0\n100\n") == "1", "minimum size"
# Maximum x and y
assert run("5 7 7\n5 4 3 2 1\n") == "5", "x+y > n-1 boundary"
# Edge at start
assert run("5 1 1\n1 2 3 4 5\n") == "1", "first day is earliest"
# Edge at end
assert run("5 1 1\n5 4 3 2 1\n") == "5", "last day is earliest"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 0 0\n100`| 1 | 最小尺寸输入 |
 |`5 7 7\n5 4 3 2 1`| 5 | 查看窗口超出可用天数 |
 |`5 1 1\n1 2 3 4 5`| 1 | 最早的一天是第一天 |
 |`5 1 1\n5 4 3 2 1`| 5 | 最早的一天是最后一天 |

 ## 边缘情况
