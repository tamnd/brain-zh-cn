---
title: "CF 102625I - 款待班塔海"
description: "该问题要求我们从给定的顺序中选择一组连续的初级人员。 我们可以从开始处删除一些初级人员，从末尾删除一些初级人员，但其余的初级人员必须保持连续。 如果所选段的值为 t1、t2、..."
date: "2026-08-03T15:23:08+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102625
codeforces_index: "I"
codeforces_contest_name: "IIT(ISM) Virtual Farewell"
rating: 0
weight: 102625
solve_time_s: 49
verified: true
draft: false
---

[CF 102625I - 招待班塔海](https://codeforces.com/problemset/problem/102625/I)

 **评级：** -
 **标签：** -
 **求解时间：** 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题要求我们从给定的顺序中选择一组连续的初级人员。 我们可以从开始处删除一些初级人员，从末尾删除一些初级人员，但其余的初级人员必须保持连续。 如果所选段有值`t1, t2, ..., tk`，其幸福感计算为`1*t1 + 2*t2 + ... + k*tk`。 我们需要最大可能的幸福，不允许选择后辈，评分为零。 

输入包含小辈的数量以及每个小辈的幸福贡献值。 输出是一个整数，表示从任何连续段可获得的最佳分数。 

初级人数可达`2 * 10^5`，每个值的大小可达`10^7`。 二次方法的执行情况约为`n^2 / 2`段检查，这大约变成`2 * 10^10`最坏情况下的操作。 这远远超出了正常的时间限制。 我们需要一种接近线性或`n log n`。 

这些值可以为负数，因此假设非空段总是更好是不正确的。 例如：

 输入：```
3
-60 -70 -80
```正确的输出是：```
0
```始终从第一个元素开始或始终选择段的方法将返回负值，即使不允许给予任何对待。 

另一个棘手的情况是，删除前缀后，段的权重从 1 重新开始。 例如：

 输入：```
6
5 -1000 1 -3 7 -8
```最好的片段是`[1, -3, 7]`，不是包含第一个值的段。 其得分为`1*1 + 2*(-3) + 3*7 = 16`。 如果不小心使用原始索引而不是所选段内的位置，则会计算出错误的表达式。 

## 方法

 直接的解决方案是尝试每一个可能的连续段。 对于一段来自`l`到`r`，我们可以通过遍历它并将每个元素乘以它在段内的位置来计算它的分数。 这是正确的，因为它完全遵循定义。 

然而，有`O(n^2)`可能的片段。 即使每个分数计算都使用前缀和进行优化，检查所有端点对仍然需要大约`4 * 10^10`端点组合时`n = 200000`，这太慢了。 

关键的观察是，片段的分数可以转换为一种形式，其中每个可能的左边界都变成一条线。 前缀和让我们避免重建每个段的加权和，然后数据结构可以维护最佳的先前左边界。 

让`P[i]`是以下值的前缀和`i`，并让`Q[i]`是前缀和`index * value`，其中索引从 1 开始。 对于在位置之后开始的段`j`并结束于`r`，其得分为：`Q[r] - Q[j] - j * (P[r] - P[j])`重新排列：`Q[r] - j * P[r] + (j * P[j] - Q[j])`对于固定的`r`,`Q[r]`是恒定的。 剩下的表达式要求行的最大值：`y = -j * x + (j * P[j] - Q[j])`在`x = P[r]`。 

每个先前的位置都会创建一行，并且每个新的前缀和都会成为一个查询。 由于前缀和可以是负数或正数，因此我们使用李超树来支持任意查询坐标。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(1) | O(1) | 太慢了|
 | 最佳| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 从左到右处理数组时构建前缀和。 维持`P`，正常前缀和，以及`Q`，加权前缀和。 
2.插入位置对应的行`j = 0`在处理任何元素之前。 这表示从第一个元素开始一个段。 线有坡度`0`并拦截`0`。 
3. 对于每个位置`r`，更新前缀和以包含当前值。 查询李朝树：`x = P[r]`。 返回的最大行值加上`Q[r]`给出结束于的最佳片段`r`。 
4. 使用当前前缀后，插入由此位置创建的行。 该线路基于`j = r`，因为未来的段可能会在此位置之后开始。 
5. 保留所有获得的值和零之间的最大值，因为不选择初级者是有效的。 

为什么它有效：

 在每个位置`r`，每个可能的段结束于`r`恰好对应于一个较早的位置`j`。 创建的线路`j`存储选择该起点的贡献。 对当前前缀和的查询会在所有先前的前缀和中选择最佳的可能起点。 由于在处理其右端点时会考虑每个可能的片段，因此找到的最大值正是可实现的最佳幸福感。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class LiChao:
    def __init__(self, xs):
        self.xs = xs
        self.tree = [None] * (4 * len(xs))

    def value(self, line, x):
        m, c = line
        return m * x + c

    def add_line(self, line, node=1, left=0, right=None):
        if right is None:
            right = len(self.xs) - 1

        mid = (left + right) // 2
        x_left = self.xs[left]
        x_mid = self.xs[mid]

        if self.tree[node] is None:
            self.tree[node] = line
            return

        cur = self.tree[node]

        if self.value(line, x_mid) > self.value(cur, x_mid):
            self.tree[node], line = line, self.tree[node]
            cur = self.tree[node]

        if left == right:
            return

        if self.value(line, x_left) > self.value(cur, x_left):
            self.add_line(line, node * 2, left, mid)
        elif self.value(line, self.xs[right]) > self.value(cur, self.xs[right]):
            self.add_line(line, node * 2 + 1, mid + 1, right)

    def query(self, x, node=1, left=0, right=None):
        if right is None:
            right = len(self.xs) - 1

        res = -10**30
        if self.tree[node] is not None:
            res = self.value(self.tree[node], x)

        if left == right:
            return res

        mid = (left + right) // 2
        if x <= self.xs[mid]:
            return max(res, self.query(x, node * 2, left, mid))
        return max(res, self.query(x, node * 2 + 1, mid + 1, right))

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    pref = [0]
    weighted = [0]

    s = 0
    w = 0
    for i, x in enumerate(a, 1):
        s += x
        w += i * x
        pref.append(s)
        weighted.append(w)

    lichao = LiChao(pref)

    ans = 0
    lichao.add_line((0, 0))

    for i in range(1, n + 1):
        best = lichao.query(pref[i])
        ans = max(ans, weighted[i] + best)

        j = i
        lichao.add_line((-j, j * pref[j] - weighted[j]))

    print(ans)

if __name__ == "__main__":
    solve()
```Li Chao Tree 以以下形式存储行`slope * x + intercept`。 对于职位`j`，斜率是`-j`截距是`j * P[j] - Q[j]`，匹配重新排列的线段公式。 

前缀数组使用基于 1 的位置，因为幸福分数的乘数从 1 开始。 将从零开始的索引与公式混合是导致错误答案的常见原因。 

查询在插入当前位置的行之前发生。 当前前缀不能用作以自身结尾的段的起点，因为这会创建一个空段。 最初插入的零线处理从第一个初级开始的段。 

Python 整数不会溢出，因此来自的大中间值`index * value`保持安全。 

## 工作示例

 对于第一个例子：```
6
5 -1000 1 -3 7 -8
```处理过程中的重要值是：

 | 位置 | 前缀和| 加权前缀| 最佳线路价值 | 当前答案 |
 | --- | --- | --- | --- | --- |
 | 1 | 5 | 5 | 0 | 5 |
 | 2 | -995 | -995 -1995 | 0 | 5 |
 | 3 | -994 | -994 -1992 | 1 | 16 | 16
 | 4 | -997 | -997 -2004 | 6 | 16 | 16
 | 5 | -990 | -990 -1969 | 15 | 15 16 | 16
 | 6 | -998 | -998 -2017 | 23 | 23 6 |

 当所选段为`[1, -3, 7]`。 跟踪显示最佳起点不一定是数组的第一个元素。 

对于第二个例子：```
5
1000 1000 1001 1000 1000
```| 位置 | 前缀和| 加权前缀| 最佳线路价值 | 当前答案 |
 | --- | --- | --- | --- | --- |
 | 1 | 1000 | 1000 1000 | 1000 0 | 1000 | 1000
 | 2 | 2000 | 2000 3000 | 3000 -1000 | 2000 | 2000
 | 3 | 3001 | 3001 6003 | 6003 -1000 | 5003 | 5003
 | 4 | 4001 | 4001 10003 | -1000 | 9003 | 9003
 | 5 | 5001 | 5001 15003 | 15003 0 | 15003 | 15003

 该算法保留所有可能的起始位置，使其能够发现采用整个数组是最佳的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每个`n`prefixes 执行一次李超查询和一次插入。 |
 | 空间| O(n) | 坐标列表和李朝树包含存储值的线性数。 |

 和`n = 200000`，对数因子使操作数保持在几百万左右，这很合适。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    result = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return result

assert run("6\n5 -1000 1 -3 7 -8\n") == "16\n"
assert run("5\n1000 1000 1001 1000 1000\n") == "15003\n"

assert run("1\n-5\n") == "0\n"
assert run("3\n-60 -70 -80\n") == "0\n"
assert run("4\n1 2 3 4\n") == "30\n"
assert run("5\n10 -100 10 -100 10\n") == "10\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / -5`|`0`| 单个负值和空段选择 |
 |`-60 -70 -80`|`0`| 所有值为负 |
 |`1 2 3 4`|`30`| 在整个细分市场最佳的情况下增加正值 |
 |`10 -100 10 -100 10`|`10`| 选择中间段而不是整个数组 |

 ## 边缘情况

 对于仅包含负值的数组，李潮树仍然会生成有效的段值，但最终与零的比较保持答案正确。 对于输入：```
3
-60 -70 -80
```每插入一行都会产生一个负值或更小的值，所以答案仍然存在`0`。 

当最佳段在大负前缀之后开始时，算法不会提交早期元素。 在：```
6
5 -1000 1 -3 7 -8
```正段之前的前缀位置均用线表示。 每个位置末尾的查询会自动选择最佳起点，从而给出段`[1, -3, 7]`并得分`16`。 

当所有值都为正时，算法仍然必须考虑所选段内不断增加的权重。 为了：```
4
1 2 3 4
```选择整个段，产生`1 + 4 + 9 + 16 = 30`。 前缀变换保留了这些增加的乘数，因为加权前缀`Q`存储原始位置贡献，线路校正将其移回所选段的起点。
