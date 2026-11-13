---
title: "CF 314C - Sereja 和子序列"
description: "我们得到一个正整数数组。 考虑数组的每个不同的非空非递减子序列。 对于每个这样的子序列 $y = (y1,dots,yk)$，我们计算每个位置满足 $$xi le yi$$ 的所有正整数序列 $x = (x1,dots,xk)$。"
date: "2026-06-06T01:18:08+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dp"]
categories: ["algorithms"]
codeforces_contest: 314
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 187 (Div. 1)"
rating: 2000
weight: 314
solve_time_s: 159
verified: true
draft: false
---

[CF 314C - Sereja 和子序列](https://codeforces.com/problemset/problem/314/C)

 **评级：** 2000
 **标签：** 数据结构，dp
 **求解时间：** 2m 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个正整数数组。 

考虑数组的每个**不同的非空非递减子序列**。 对于每个这样的子序列$y = (y_1,\dots,y_k)$，我们计算所有正整数序列$x = (x_1,\dots,x_k)$满意的$$x_i \le y_i$$对于每个职位。 

对于固定子序列$y$, 有效序列的数量$x$简直就是$$y_1 \cdot y_2 \cdots y_k$$因为每个位置都可以独立选择任意值$1$到$y_i$。 

任务是计算原始数组的所有**不同的非递减子序列**的这些乘积之和。 

数组长度达到$10^5$，并且值达到$10^6$。 枚举子序列是立即不可能的，因为长度的数组$10^5$可以有指数数量的子序列。 甚至$O(n^2)$这里太慢了，因为它需要大约$10^{10}$运营。 

值界远小于可能的子序列的数量。 这建议构建一个按值索引而不是按子序列索引的动态程序。 

一个微妙的点是**独特**这个词。 从不同位置选择但产生相同值序列的两个子序列必须仅计数一次。 

例如：```
2
1 1
```非递减子序列是：```
[1]
[1]
[1,1]
```但不同的只是：```
[1]
[1,1]
```他们的贡献是```
1 + 1 = 2
```盲目计算子序列出现次数的 DP 将产生 3 而不是 2。 

当相同的值出现多次时，另一个容易出现的错误就会出现。```
3
2 2 2
```不同的非递减子序列是：```
[2]
[2,2]
[2,2,2]
```答案是```
2 + 4 + 8 = 14
```解决方案必须小心地覆盖值 2 的旧贡献，而不是累积重复序列。 

## 方法

 蛮力的想法很简单。 生成每个子序列，仅保留非递减的子序列，将它们存储在一个集合中以删除重复项，计算每个序列的乘积，并对结果求和。 

这是正确的，因为每个不同的非递减子序列都显式生成并计数一次。 

问题是子序列的数量。 长度的数组$10^5$有$2^{100000}$子序列。 即使是为了$n=50$，枚举已经无望了。 

关键的观察是我们永远不需要子序列本身。 我们只需要他们的乘积之和。 

假设我们从左到右处理数组。 让$$F(v)$$表示所有不同的非递减子序列的总贡献，其最后一个值恰好是$v$。 

当我们遇到一个新的数组元素时$x$，每个现有子序列最多以一个值结尾$x$可以通过以下方式扩展$x$。 自从追加$x$将后续乘积乘以$x$，所有新形成的子序列的总贡献结束于$x$是$$x \cdot \sum_{t \le x} F(t).$$我们还必须包括单元素子序列$[x]$，其产品是$x$。 

这给出了$$\text{new}(x) = x \cdot \left(1 + \sum_{t \le x} F(t)\right).$$剩下的挑战是处理独特性。 

如果值$x$出现较早，一些子序列以$x$已经代表在$F(x)$。 标准技巧是替换旧的价值贡献$x$由新计算的一个。 较新的出现可以生成以以下结尾的每个不同序列$x$目前这是可能的，因此旧值已过时。 

我们需要有效地执行两个操作：

 1. 查询$\sum_{t \le x} F(t)$。 
2. 更换$F(x)$通过一个新的值。 

由于值最多是$10^6$，值坐标上的 Fenwick 树支持以下两种操作$O(\log 10^6)$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(2^n)$| 指数| 太慢了 |
 | 最佳 |$O(n \log V)$|$O(V)$| 已接受 |

 这里$V = 10^6$。 

## 算法演练

 1. 创建一棵 Fenwick 树，索引值从 1 到$10^6$。 
2. 维护数组`last[v]`，它存储当前的贡献$F(v)$。 
3. 从左到右处理输入数组。 
4. 对于当前值$x$，查询 Fenwick 树$$S = \sum_{t \le x} F(t).$$这表示所有不同的非递减子序列的总贡献，其最后一个元素最多为$x$。 
5. 计算$$cur = x \cdot (1 + S).$$期限$1$创建单元素子序列$[x]$。 期限$S$扩展每个最多以一个值结尾的有效子序列$x$。 
6.让`old = last[x]`。 

我们正在替换全部价值贡献$x$，不添加到其中。 这就是删除因重复出现相同值而创建的重复项的方法。 
7. 通过添加更新 Fenwick 树$$cur - old.$$执行此操作后，芬威克树再次存储正确的值$F(v)$。 
8. 设置`last[x] = cur`。 
9. 所有元素处理完毕后，答案就是所有元素之和$F(v)$，它等于整个范围内的 Fenwick 前缀总和。 

### 为什么它有效

 处理完数组的任意前缀后，$F(v)$被定义为从该前缀获得的所有**不同**非递减子序列的总乘积和，其最终值等于$v$。 

当有新值时$x$到达，每个子序列最多以一个值结尾$x$可以通过以下方式扩展$x$，每个乘积都乘以$x$。 添加单元素子序列恰好产生$$x \cdot \left(1 + \sum_{t \le x} F(t)\right).$$如果$x$前面出现过，新计算的值已经代表了以结尾的不同子序列的完整集合$x$可以由当前前缀组成。 替换之前的$F(x)$防止重复计数相同的值序列。 通过对处理后的位置进行归纳，不变式对于每个值都保持正确。 最终所有的总和$F(v)$正是所需的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1000000007
MAXV = 1000000

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, idx, delta):
        n = self.n
        bit = self.bit
        while idx <= n:
            bit[idx] = (bit[idx] + delta) % MOD
            idx += idx & -idx

    def sum(self, idx):
        res = 0
        bit = self.bit
        while idx > 0:
            res += bit[idx]
            res %= MOD
            idx -= idx & -idx
        return res

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    fw = Fenwick(MAXV)
    last = [0] * (MAXV + 1)

    for x in a:
        s = fw.sum(x)
        cur = x * (1 + s) % MOD

        old = last[x]
        last[x] = cur

        fw.add(x, (cur - old) % MOD)

    print(fw.sum(MAXV))

if __name__ == "__main__":
    solve()
```Fenwick 树存储当前值$F(v)$。 前缀查询给出$\sum_{t \le x} F(t)$，这正是递归所需的数量。 

数组`last`是关键的细节。 如果没有它，重复的值将累积贡献而不是替换它们，从而导致重复的子序列被多次计数。 

更新使用`cur - old`因为芬威克树存储的是当前值$F(x)$。 我们正在执行任务，而不是增量。 工作模数$10^9+7$意味着在插入之前还必须以模数为模来减小差值。 

最终答案就是所有答案的总和$F(v)$，通过完整的 Fenwick 前缀查询获得。 

## 工作示例

 ### 示例 1

 输入：```
1
42
```| 步骤| x| 前缀和 S | 当前| F（42）|
 | --- | --- | --- | --- | --- |
 | 1 | 42 | 42 0 | 42 | 42 42 | 42

 最终答案：```
42
```唯一不同的非递减子序列是`[42]`，其贡献为 42。 

### 示例 2

 输入：```
2
1 1
```| 步骤| x| 前缀和 S | 当前| 老F(1) | 新 F(1) |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 0 | 1 | 0 | 1 |
 | 2 | 1 | 1 | 2 | 1 | 2 |

 最终答案：```
2
```不同的子序列是：```
[1]
[1,1]
```有贡献```
1 + 1 = 2.
```该痕迹显示了为什么需要更换。 第二次出现后，`F(1)`变成2，而不是3。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \log V)$| 每个元素进行一次 Fenwick 查询和一次更新 |
 | 空间|$O(V)$| 芬威克树和`last`数组超过值$1 \ldots 10^6$|

 和$n = 10^5$和$V = 10^6$,$\log V$约为 20。该解决方案仅执行几百万次原始操作，完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

MOD = 1000000007
MAXV = 1000000

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    class Fenwick:
        def __init__(self, n):
            self.n = n
            self.bit = [0] * (n + 1)

        def add(self, idx, delta):
            while idx <= self.n:
                self.bit[idx] = (self.bit[idx] + delta) % MOD
                idx += idx & -idx

        def sum(self, idx):
            res = 0
            while idx > 0:
                res = (res + self.bit[idx]) % MOD
                idx -= idx & -idx
            return res

    n = int(input())
    a = list(map(int, input().split()))

    fw = Fenwick(MAXV)
    last = [0] * (MAXV + 1)

    for x in a:
        s = fw.sum(x)
        cur = x * (1 + s) % MOD
        fw.add(x, (cur - last[x]) % MOD)
        last[x] = cur

    return str(fw.sum(MAXV)) + "\n"

# provided sample
assert run("1\n42\n") == "42\n", "sample 1"

# custom cases
assert run("1\n1\n") == "1\n", "minimum size"
assert run("2\n1 1\n") == "2\n", "duplicate values"
assert run("2\n1 2\n") == "5\n", "strictly increasing"
assert run("3\n2 2 2\n") == "14\n", "all equal values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1`|`1`| 尽可能小的实例 |
 |`1 1`|`2`| 独特的子序列处理 |
 |`1 2`|`5`| 基本扩展递归 |
 |`2 2 2`|`14`| 重复覆盖相同值 |

 ## 边缘情况

 考虑：```
2
1 1
```在第一个值之后，`F(1)=1`。 在第二个值之后，直到 1 的前缀和也为 1，给出`cur=2`。 该算法取代`F(1)`乘以 2。最终答案是 2，正好对应`[1]`和`[1,1]`。 单纯的累加会错误地产生 3。 

考虑：```
3
2 2 2
```这些州是：```
F(2)=2
F(2)=6
F(2)=14
```每次更新都会替换以前的值。 最终答案变成14，等于```
2 + 4 + 8
```对于不同的子序列`[2]`,`[2,2]`， 和`[2,2,2]`。 

考虑：```
2
2 1
```子序列`[2,1]`不是不减的，不能贡献。 该算法自然会强制执行此操作，因为仅允许从值进行扩展`<= x`。 加工时`1`，以结尾的序列的贡献`2`被排除在前缀查询之外。 答案就变成了```
2 + 1 = 3
```匹配有效的子序列`[2]`和`[1]`。
