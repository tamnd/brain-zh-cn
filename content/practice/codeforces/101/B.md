---
title: "CF 101B - 公共汽车"
description: "我们在 0 到 n 的线路上设有巴士站。 Gerald 从第 0 站出发，想要到达第 n 站。 每条总线由一个区间[s,t]描述。 杰拉德可以在从 s 到 t - 1 的任何站点登上该公共汽车，但是一旦他乘坐了该公共汽车，他必须一直停留到 t 站。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dp"]
categories: ["algorithms"]
codeforces_contest: 101
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 79 (Div. 1 Only)"
rating: 1700
weight: 101
solve_time_s: 117
verified: true
draft: false
---

[CF 101B - 总线](https://codeforces.com/problemset/problem/101/B)

 **评分：** 1700
 **标签：** 二分查找、数据结构、dp
 **求解时间：** 1m 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在线路上设有巴士站，从`0`到`n`。 杰拉德从站开始`0`并想要到达车站`n`。 

每条总线由一个区间描述`[s, t]`。 杰拉德 (Gerald) 可以在以下任意站点搭乘巴士：`s`通过`t - 1`，但是一旦他骑上它，他就必须坚持下去直到停下来`t`。 他无法向后移动，也无法在停靠点之间行走。 

如果相邻站点之间至少存在杰拉尔德乘坐不同公交车的路段，则两条路线被视为不同。 实际上，这意味着公交车的确切顺序很重要。 

任务是计算到达终点站的有效方式有多少种`n`。 

这些约束完全塑造了解决方案。 停靠站数量`n`可以大到`10^9`，因此任何迭代每一站的算法都是不可能的。 同时，公交车数量仅为`10^5`，这强烈表明只有输入中出现的停止才是相关的。 

直接的图表解释会有所帮助。 每辆巴士都会从每个站点出发进行换乘`[s, t-1]`进入停止状态`t`。 如果我们定义`dp[x]`作为到达站点的方式数量`x`，那么每辆总线贡献：$$dp[t] += dp[s] + dp[s+1] + \dots + dp[t-1]$$困难在于有效地计算这些范围总和。 

一些边缘情况很容易被错误处理。 

考虑：```
3 1
0 2
```正确答案是`0`。 杰拉德可以到达车站`2`，但是没有办法继续停止`3`。 假设到达最远总线端点就足够的粗心实现将错误地返回`1`。 

另一个微妙的情况是多辆巴士在同一站结束：```
2 2
0 2
1 2
```正确答案是`1`。 

第二辆巴士没用，因为停了`1`本身是无法到达的。 一个简单的实现，只计算结束于`2`可能会错误地产生`2`。 

重叠的总线也很重要：```
4 4
0 1
0 2
1 4
2 4
```正确答案是`2`。 

杰拉德可以选择`0→1→4`或者`0→2→4`。 总线严重重叠，因此在不考虑可达性的情况下独立计算转换会导致计数过多。 

最危险的错误来自于尝试直接处理止损。 自从`n`或许`10^9`，甚至分配一个大小的数组`n+1`是不可能的。 

## 方法

 蛮力思想直接遵循递归。 

定义`dp[x]`作为到达车站的方式数量`x`。 最初，`dp[0] = 1`。 对于每辆巴士`(s, t)`，我们添加到达每个可能的登机站的方式数量：$$dp[t] += \sum_{i=s}^{t-1} dp[i]$$如果我们逐字地计算每条总线的总和，那么在最坏的情况下，复杂性会变成二次方。 和`10^5`公共汽车，以及每个间隔可能跨越`10^5`相关岗位，总工作量可以接近`10^{10}`运营。 

瓶颈很明显：重复对大范围求和。 

关键的观察是递归仅取决于前缀和`dp`。 

如果我们维持：$$pref[i] = dp[0] + dp[1] + \dots + dp[i]$$然后：$$dp[t] += pref[t-1] - pref[s-1]$$现在每次转换都变成常数时间。 

仅此还不够，因为停靠次数达到了`10^9`。 第二个观察结果是只有总线端点很重要。 如果没有公共汽车在某个站点开始或结束，那么那里就不会发生任何有趣的事情。 

我们通过收集公交车中出现的所有不同的停靠站值来压缩坐标，以及`0`和`n`。 对它们进行排序后，我们只处理压缩​​索引。 

然后，巴士将按终点站排序。 当我们从左到右扫描时，我们在压缩位置上维护前缀和。 每辆公交车都会向其目的地贡献一定的里程总和。 

这将问题转化为具有前缀和和坐标压缩的动态规划。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(平方米) | O(米) | 太慢了 |
 | 最佳 | O(m log m) | O(米) | 已接受 |

 ## 算法演练

 1. 读取所有公交车并收集输入中出现的每个站点，以及`0`和`n`。 

我们无法处理原始坐标范围，因为停靠点可能大到`10^9`。 
2. 对收集到的坐标进行排序和去重。 

这将创建压缩坐标系。 
3. 将每个原始停止值映射到其压缩索引。 

压缩后，所有相关停靠点都位于密集范围内`[0, k-1]`。 
4. 按目的地车站对巴士进行分组。 

我们从左到右处理停靠点，因此当计算到达某个停靠点的方法时`t`，每个较早的停止点都已经有一个最终值。 
5. 初始化`dp[start_index_of_0] = 1`。 

杰拉德从站开始`0`完全以一种方式。 
6. 维护一个存储前缀和的 Fenwick 树`dp`。 

芬威克树支持：

 - 为压缩停止添加一个值
 - 查询一系列压缩止损的总和
 7. 按升序处理压缩停靠点。 

对于每辆巴士`(s, t)`在当前站点结束：

 - 查询到达任意站点的总路线数`[s, t-1]`- 将该值添加到`dp[t]`这完全符合递推关系。 
8. 完成所有终点站的公交车后，插入`dp[stop]`进入芬威克树。 

未来的巴士可能会使用此站作为上车位置。 
9. 输出`dp[n] mod 10^9+7`。 

### 为什么它有效

 不变量是：`dp[x]`始终等于到达停靠点的有效方式数`x`仅使用目的地已处理的公交车。 

处理总线时`(s, t)`，杰拉德可以在任何可到达的站点上车`[s, t-1]`。 芬威克树准确存储了`dp`已处理站点的值，因此查询该范围会给出使用该总线的有效方式的总数。 

由于停靠点是按递增顺序处理的，因此每条路径都有助于`dp[t]`之前已经确定了`t`被计算出来。 未来的过渡无法创建通往较早站点的路径，因为公交车只会向前行驶。 

因此，每条有效路线都只计算一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, idx, val):
        idx += 1
        while idx <= self.n:
            self.bit[idx] = (self.bit[idx] + val) % MOD
            idx += idx & -idx

    def sum(self, idx):
        idx += 1
        res = 0
        while idx > 0:
            res = (res + self.bit[idx]) % MOD
            idx -= idx & -idx
        return res

    def range_sum(self, left, right):
        if left > right:
            return 0
        return (self.sum(right) - self.sum(left - 1)) % MOD

def main():
    n, m = map(int, input().split())

    buses = []
    coords = {0, n}

    for _ in range(m):
        s, t = map(int, input().split())
        buses.append((s, t))
        coords.add(s)
        coords.add(t)

    coords = sorted(coords)
    comp = {x: i for i, x in enumerate(coords)}

    k = len(coords)

    ending = [[] for _ in range(k)]

    for s, t in buses:
        cs = comp[s]
        ct = comp[t]
        ending[ct].append(cs)

    dp = [0] * k

    start = comp[0]
    dp[start] = 1

    fw = Fenwick(k)
    fw.add(start, 1)

    for t_idx in range(k):
        if t_idx == start:
            continue

        ways = 0

        for s_idx in ending[t_idx]:
            ways += fw.range_sum(s_idx, t_idx - 1)
            ways %= MOD

        dp[t_idx] = ways
        fw.add(t_idx, ways)

    print(dp[comp[n]] % MOD)

if __name__ == "__main__":
    main()
```解决方案从坐标压缩开始。 由于停靠点值可能很大，因此我们只保留实际出现在公交车中或作为端点的停靠点`0`和`n`。 

巴士按目的地索引分组。 这避免了在扫描期间重复扫描所有总线。 

芬威克树存储可达路径的前缀和。 它是`range_sum(l, r)`方法计算：$$dp[l] + dp[l+1] + \dots + dp[r]$$在对数时间内。 

一个微妙的实现细节是处理顺序。 我们必须首先完成所有的贡献`dp[t]`插入之前`dp[t]`进入芬威克树。 否则，巴士终点站为`t`可能会错误地使用停止`t`本身作为登机点。 

另一个容易犯的错误是处理空范围。 如果`s_idx > t_idx - 1`，那么总线就没有贡献。 辅助方法返回`0`在这种情况下。 

每次更新后都会应用模运算，因为路径数量呈指数增长。 

## 工作示例

 ### 示例 1

 输入：```
2 2
0 1
1 2
```压缩坐标：```
[0, 1, 2]
```| 当前止损| 进站巴士 | 查询范围 | 新增方式 | DP |
 | --- | --- | --- | --- | --- |
 | 0 | 无 | 无 | 无 | [1,0,0]|
 | 1 | (0,1)| [0,0]| 1 | [1,1,0]|
 | 2 | (1,2) | [1,1]| 1 | [1,1,1]|

 最终答案：`1`。 

该迹线显示了基本的重现。 每辆公交车在跳到终点之前都会收集所有可到达的上车位置。 

### 示例 2

 输入：```
4 4
0 1
0 2
1 4
2 4
```压缩坐标：```
[0,1,2,4]
```| 当前止损| 进站巴士 | 查询范围 | 新增方式 | DP |
 | --- | --- | --- | --- | --- |
 | 0 | 无 | 无 | 无 | [1,0,0,0]|
 | 1 | (0,1)| [0,0]| 1 | [1,1,0,0]|
 | 2 | (0,2) | [0,1]| 2 | [1,1,2,0]|
 | 4 | (1,4), (2,4) | [1,2], [2,2] | 3 + 2 | [1,1,2,5]|

 最终答案：`5`。 

这五条路线是：

 1.`0→1→4`2.`0→2→4`3.`0→1→2→4`4.`0→2→4`直接乘坐第二路公交车
 5.`0→1→2→4`通过不同的巴士选择

 这说明了为什么重叠间隔通过前缀和自然地组合在一起。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m log m) | 协调压缩、Fenwick 更新和范围查询 |
 | 空间| O(米) | 存储总线、压缩坐标、Fenwick 树和 DP 数组 |

 至多有`10^5`公共汽车,`O(m log m)`很容易在时间限制内完成。 内存使用量也与总线数量保持线性关系，远低于限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

MOD = 10**9 + 7

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    class Fenwick:
        def __init__(self, n):
            self.n = n
            self.bit = [0] * (n + 1)

        def add(self, idx, val):
            idx += 1
            while idx <= self.n:
                self.bit[idx] = (self.bit[idx] + val) % MOD
                idx += idx & -idx

        def sum(self, idx):
            idx += 1
            res = 0
            while idx > 0:
                res = (res + self.bit[idx]) % MOD
                idx -= idx & -idx
            return res

        def range_sum(self, l, r):
            if l > r:
                return 0
            return (self.sum(r) - self.sum(l - 1)) % MOD

    n, m = map(int, input().split())

    buses = []
    coords = {0, n}

    for _ in range(m):
        s, t = map(int, input().split())
        buses.append((s, t))
        coords.add(s)
        coords.add(t)

    coords = sorted(coords)
    comp = {x: i for i, x in enumerate(coords)}

    k = len(coords)

    ending = [[] for _ in range(k)]

    for s, t in buses:
        ending[comp[t]].append(comp[s])

    dp = [0] * k

    start = comp[0]
    dp[start] = 1

    fw = Fenwick(k)
    fw.add(start, 1)

    for t_idx in range(k):
        if t_idx == start:
            continue

        ways = 0

        for s_idx in ending[t_idx]:
            ways += fw.range_sum(s_idx, t_idx - 1)
            ways %= MOD

        dp[t_idx] = ways
        fw.add(t_idx, ways)

    return str(dp[comp[n]]) + "\n"

# provided sample
assert run(
"""2 2
0 1
1 2
"""
) == "1\n", "sample 1"

# unreachable destination
assert run(
"""3 1
0 2
"""
) == "0\n", "unreachable destination"

# direct bus only
assert run(
"""5 1
0 5
"""
) == "1\n", "single direct bus"

# overlapping intervals
assert run(
"""4 4
0 1
0 2
1 4
2 4
"""
) == "5\n", "overlapping buses"

# no buses
assert run(
"""1 0
"""
) == "0\n", "empty graph"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 1 / 0 2`|`0`| 目的地无法到达 |
 |`5 1 / 0 5`|`1`| 单条直达航线|
 | 重叠间隔示例 |`5`| 多重交互转变 |
 |`1 0`|`0`| 根本没有公交车|

 ## 边缘情况

 考虑无法到达目标的情况：```
3 1
0 2
```压缩后的坐标变成`[0,2,3]`。 

最初：```
dp[0] = 1
```加工停止`2`：

- 公共汽车`(0,2)`查询范围`[0,1]`- 只能停下来`0`贡献
 -`dp[2] = 1`加工停止`3`：

 - 没有巴士终点站
 -`dp[3] = 0`算法正确输出`0`因为没有过渡到达学校。 

现在考虑重叠总线：```
2 2
0 2
1 2
```压缩后的坐标为`[0,1,2]`。 

加工停止时`2`：

- 公共汽车`(0,2)`贡献方式`[0,1]`- 只能停下来`0`可达
 - 贡献=`1`- 公共汽车`(1,2)`贡献方式`[1,1]`- 停止`1`无法到达
 - 贡献=`0`全部的：```
dp[2] = 1
```这证实了该算法永远不会计算其登机范围仅包含无法到达的站点的公交车。 

最后，考虑稀疏坐标：```
1000000000 2
0 5
5 1000000000
```该算法将坐标压缩为：```
[0,5,1000000000]
```尽管原始坐标范围很大，但只存储了三个状态。 这正是坐标压缩是必要的原因。
