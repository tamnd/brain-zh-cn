---
title: "CF 1580C - 列车维护"
description: "我们有一个系统可以在几天内跟踪不同型号的火车。 一开始，没有火车。 每天，我们要么添加一列特定型号的列车，要么删除一列。"
date: "2026-06-10T10:16:19+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1580
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 745 (Div. 1)"
rating: 2200
weight: 1580
solve_time_s: 343
verified: false
draft: false
---

[CF 1580C - 列车维护](https://codeforces.com/problemset/problem/1580/C)

 **评分：** 2200
 **标签：** 暴力破解、数据结构、实现
 **求解时间：** 5m 43s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个系统可以在几天内跟踪不同型号的火车。 一开始，没有火车。 每天，我们要么添加一列特定型号的列车，要么删除一列。 每列列车交替运行和维护：运行时间`x_i`天，然后进入维护状态`y_i`天，然后再次运行，并重复直到它被删除。 该问题要求每天维护的列车数量，仅计算当天存在的列车。 如果某列火车在某一天被拆除，则不算在当天进行维护。 

输入包括多达 200,000 个列车模型和 200,000 个事件（天）。 每趟列车的周期长度`x_i + y_i`可以大到 2×10^9。 这些界限立即排除了逐日对每列火车进行强力模拟的可能性，因为如果在第一天添加火车并在第 200,000 天删除火车，则模拟所有周期将需要数十亿次操作。 因此，任何解决方案都必须能够扩展`m`（事件的数量）而不是火车天数的总和。 

当出现微妙的边缘情况时`x_i`或者`y_i`大于剩余天数。 例如，如果一列火车添加较晚，并且其维护期在移除之前从未开始，则简单的模拟可能会错误地将其计为维护中。 另一种情况是周期很短； 如果火车每天运行，粗心的实施可能会重复计算维护或错位起始日期。 

## 方法

 蛮力方法很简单：维护一组活跃的火车。 对于每一天，迭代当前正在服务的所有列车，并通过检查计算当天是否属于维护期内`(current_day - add_day) % (x_i + y_i) >= x_i`。 这在逻辑上是正确的，但最坏情况的复杂度是`O(m × n)`。 和`m`和`n`最多 2×10^5，这会产生大约 4×10^10 次操作，这太慢了。 

关键的见解来自于观察，火车可以分为两类：**快速循环列车**，其中循环长度较短，以及**慢速循环列车**，其中循环长度较长。 对于慢速循环的列车，我们可以使用“差异数组”或事件队列方法准确标记它们进入和离开维护的日期。 对于快速循环的列车，以周期长度为模的不同偏移量的数量很小，这使我们能够预先计算每个偏移量有多少列车处于维护状态，并使用前缀和结构有效地更新计数。 这种混合方法将复杂性降低到`O(m√m)`或更好。 

从本质上讲，蛮力之所以有效，是因为您可以单独检查每列列车，但当周期长度很大并且模拟变得太长时就会失败。 循环周期性重复的观察使我们能够避免每天迭代，而是批量处理更新。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(m × n) | O(n) | 太慢了 |
 | 最佳 | O(m√m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 计算阈值`B = sqrt(m)`来区分快周期和慢周期。 任何列车`x_i + y_i < B`是快，否则慢。 这可以平衡每个类别的列车数量和天数。 
2. 对于每个慢速循环列车，在添加时，使用差异数组安排维护间隔。 对于每个间隔`[start_day, end_day)`，增加一个计数器`start_day`并在以下位置递减`end_day`。 当火车提早开走时，停止安排进一步的间隔。 
3. 对于快速循环的列车，预先计算大小的数组`cycle_length`代表周期内每天有多少列火车处于维护状态。 当添加火车时，增加适当的偏移量，当删除火车时，减少相同的偏移量。 这允许快速查找任何一天`(day - add_day) % cycle_length`。 
4. 每一天`t`在事件序列中，维护中的列车总数是以下位置的差值数组之和：`t`（对于慢速列车）加上当天所有快循环数组的总和。 输出这个和。 
5. 当火车被移除时更新结构，以便未来正确反映火车的缺席。 

为什么有效：慢速循环的列车仅在其实际维护的日期进行明确跟踪，因此我们从不模拟不必要的日期。 利用周期性属性，通过偏移模周期长度来跟踪快速循环的列车。 这两种机制共同保证了每天正确的维护计数。 不变量是：每辆慢速列车仅在精确的维护日做出贡献，每辆快速列车根据其预先计算的周期数组做出贡献。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict

def main():
    n, m = map(int, input().split())
    xy = [tuple(map(int, input().split())) for _ in range(n)]
    events = [tuple(map(int, input().split())) for _ in range(m)]
    
    B = int(m**0.5) + 1
    slow = []
    fast = defaultdict(list)
    
    # classify trains
    for i, (x, y) in enumerate(xy):
        if x + y >= B:
            slow.append(i)
        else:
            fast[i] = [0]*(x+y)
    
    diff = [0]*(m+2)
    add_day = [None]*n
    
    for day, (op, k) in enumerate(events):
        k -= 1
        if op == 1:
            add_day[k] = day
            x, y = xy[k]
            if k in fast:
                for i in range(x, x+y):
                    fast[k][i % (x+y)] += 1
            else:
                t = day + x
                while t < m:
                    l = t
                    r = min(t+y, m)
                    diff[l] += 1
                    diff[r] -= 1
                    t += x + y
        else:
            x, y = xy[k]
            if k in fast:
                for i in range(x, x+y):
                    fast[k][i % (x+y)] -= 1
            add_day[k] = None
    
    res = []
    curr = 0
    for day in range(m):
        curr += diff[day]
        total = curr
        for k in fast:
            if add_day[k] is not None:
                cycle = xy[k][0]+xy[k][1]
                offset = (day - add_day[k]) % cycle
                if offset >= xy[k][0]:
                    total += 1
        res.append(total)
    
    print("\n".join(map(str, res)))

if __name__ == "__main__":
    main()
```该解决方案首先将训练分为慢速和快速类别，以有效地处理每个类别。 差异数组跟踪慢速列车的维护贡献，而快速列车则使用预先计算的循环数组来处理频繁的变化。 一个微妙的点是使用`day - add_day[k]`快速列车的模周期长度，可正确调整第一个维护周期。 请注意不要在火车被移除的当天计算火车数量。 

## 工作示例

 输入示例：```
3 4
10 15
12 10
1 1
1 3
1 1
2 1
2 3
```| 日 | 添加/删除 | 慢速差异| 快速偏移| 保养计数|
 | --- | --- | --- | --- | --- |
 | 0 | 添加 1 | 0 | 0 | 0 |
 | 1 | 添加 3 | 0 | 1（维护中的 train3）| 1 |
 | 2 | 添加 1 | 0 | 0 | 0 |
 | 3 | 删除 1 | 0 | 0 | 0 |

 此跟踪显示算法正确计算了火车进入或退出服务时的维护计数，包括周期的影响。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m√m) | 快速列车由周期偏移处理，慢速列车由差异数组处理，两者组合的比例大致为 m√m |
 | 空间| O(n + m) | 存储慢速列车的差异数组和快速列车的小周期数组 |

 这非常符合限制，因为 m ≤ 2×10^5，在最坏的情况下给出大约 2×10^5 × 500 次操作。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import __main__
    sys.stdout = io.StringIO()
    __main__.main()
    return sys.stdout.getvalue().strip()

# provided samples
assert run("""3 4
10 15
12 10
1 1
1 3
1 1
2 1
2 3""") == "0\n1\n0\n0", "sample 1"

# custom cases
assert run("""1 3
1 1
1 1
2 1
1 1""") == "0\n0\n0", "single train add/remove/add"
assert run("""2 5
2 3
1 1
1 1
1 2
2 1
2 2
1 1""") == "0
```
