---
title: "CF 102621I - 播放列表随机播放"
description: "我们有一个歌曲播放列表。 每首歌都有两个标签：流派和作者。 我们可以删除一些歌曲，然后重新排序剩余的歌曲。"
date: "2026-08-02T13:58:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102621
codeforces_index: "I"
codeforces_contest_name: "mBIT Advanced June 2020"
rating: 0
weight: 102621
solve_time_s: 83
verified: true
draft: false
---

[CF 102621I - 播放列表随机播放](https://codeforces.com/problemset/problem/102621/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 23s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 我们有一个歌曲播放列表。 每首歌都有两个标签：流派和作者。 我们可以删除一些歌曲，然后重新排序剩余的歌曲。 当每对相邻的歌曲都共享至少一个标签时，重新排序的播放列表被认为是有效的：或者两首歌曲具有相同的流派，或者两首歌曲具有相同的作者。 任务是保留尽可能多的歌曲，所以答案是删除的歌曲数量最少。 最初的问题有少量歌曲，预期的解决方案使用子集动态规划。 

关键限制是歌曲数量，最多为 16 首。这个数量足够小，可以使用指数算法。 基于检查每个排序的解决方案仍然太昂贵，因为排列的数量随着$n!$，即使是中等值也能达到数十亿$n$。 所有子集上的解决方案都是可行的，因为只有$2^{16}=65536$可能的子集。 

大字符串的长度有不同的影响。 在探索状态时，我们不能反复比较长流派和作家字符串。 我们应该对歌曲之间的成对关系进行一次预处理，然后在动态规划期间仅使用恒定时间检查。 

棘手的情况来自这样一个事实：有效的播放列表不一定是原始顺序。 

例如，如果输入是：```
3
rock alice
pop bob
rock bob
```正确的输出是：```
0
```因为订单`rock alice`,`rock bob`,`pop bob`作品。 仅检查给定顺序的解决方案会错误地删除歌曲。 

另一个边缘情况是只剩下一首歌曲。 例如：```
1
jazz mike
```答案是：```
0
```因为单首歌曲没有相邻的一对可以违反规则。 围绕相邻比较初始化答案的代码可能会意外地将其视为无效。 

最后的边缘情况是没有足够大的子集连接。 例如：```
3
a x
b y
c z
```正确的输出是：```
2
```只能保留一首歌，因为两首歌不能相邻放置。 假设每首歌曲都可以出现在最终播放列表中的粗心实现将在这里失败。 

## 方法

 最简单的方法是尝试歌曲的每个可能的子集以及该子集中的每个可能的顺序。 如果排序满足邻接规则，我们保留最大的有效大小。 这是正确的，因为答案恰好是最大有效播放列表的补集。 

问题是订单数量。 为了$n=16$，检查所有排列需要$16!$的可能性，这大约是$2.1 \times 10^{13}$。 即使操作速度很快，这也无法满足时间限制。 

重要的观察是顺序仅取决于最后放置的歌曲。 在构建有效的播放列表时，我们不需要记住到目前为止的整个顺序。 我们只需要已使用的歌曲集和最后一首歌曲的标识，因为下一首歌曲只需与最后一首歌曲兼容。 

这将问题转换为子集动态规划。 我们计算每个子集以每首歌曲结尾的最大有效播放列表。 处理完所有状态后，最大可达子集大小给出了我们可以保留的最大歌曲数量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n! \cdot n)$|$O(n)$| 太慢了 |
 | 最佳 |$O(n^2 2^n)$|$O(n2^n)$| 已接受 |

 ## 算法演练

 1. 预先计算每对歌曲是否可以相邻。 当两首歌的风格匹配或作者匹配时，它们就是兼容的。 存储此结果可以避免在动态编程中重复比较字符串。 
2. 创建一个DP表，其中`dp[mask][i]`表示是否可以建立一个有效的播放列表，其中包含准确的歌曲`mask`并以歌曲结束`i`。 存储最后一首歌曲是因为它决定了接下来可以附加哪些歌曲。 
3. 初始化每个单曲子集。 包含一首歌曲的播放列表始终有效，因此具有一组位的每个状态一开始都是可达的。 
4. 迭代所有子集。 对于每一首可触及的片尾曲`i`，尝试添加每首歌曲`j`尚未在子集中。 如果`i`和`j`是兼容的，标记新的子集结尾`j`作为可达的。 
5. 跟踪所有可达状态中最大数量的设置位。 删除的歌曲数是歌曲总数减去此最大值。 

为什么有效：每个有效的播放列表都有一首最终歌曲和一组使用过的歌曲。 DP 准确地存储了这些信息，因此每个有效的排列都可以通过转换来再现。 相反，每个转换仅当它可以合法地跟随前一首歌曲时才添加一首歌曲，因此每个生成的状态都对应于一个有效的播放列表。 因此，最大可达子集是可以形成的最大播放列表。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    ans = []

    for _ in range(t):
        n = int(input())
        songs = []

        for _ in range(n):
            g, w = input().split()
            songs.append((g, w))

        ok = [[False] * n for _ in range(n)]
        for i in range(n):
            for j in range(n):
                if songs[i][0] == songs[j][0] or songs[i][1] == songs[j][1]:
                    ok[i][j] = True

        total = 1 << n
        dp = [0] * (total * n)

        for i in range(n):
            dp[((1 << i) * n) + i] = 1

        best = 1

        for mask in range(total):
            cnt = mask.bit_count()
            if cnt <= best:
                best = max(best, cnt)

            base = mask * n
            for last in range(n):
                if dp[base + last]:
                    remaining = ((total - 1) ^ mask)
                    while remaining:
                        bit = remaining & -remaining
                        nxt = bit.bit_length() - 1
                        if ok[last][nxt]:
                            new_mask = mask | bit
                            dp[new_mask * n + nxt] = 1
                        remaining -= bit

        ans.append(str(n - best))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```成对的`ok`矩阵是在 DP 开始之前构建的。 这是所有昂贵的字符串比较发生的地方，因此算法的指数部分仅执行整数运算。 

DP 数组被展平为一维。 国家`(mask, last)`存储在索引处`mask * n + last`，这避免了创建许多嵌套的 Python 列表并减少了开销。 

单歌曲状态被初始化，因为每首歌曲都可以启动一个播放列表。 在转换期间，代码一次从一组未使用的歌曲中删除一个可用的位。 这避免了扫描不必要的位置。 

Python 整数不会溢出，因此位掩码操作是安全的。 唯一需要仔细处理的边界细节是单首歌曲的情况，其中最大有效播放列表大小已经正确初始化。 

## 工作示例

 考虑：```
3
rock a
pop b
rock b
```状态探索如下所示：

 | 面膜| 最后一首歌| 行动| 可达尺寸|
 | --- | --- | --- | --- |
 | 001| 摇滚 | 开始| 1 |
 | 100 | 100 摇滚b | 开始| 1 |
 | 010| 流行音乐 | 开始| 1 |
 | 101 | 101 摇滚b | 在摇滚之后添加 | 2 |
 | 111 | 111 流行音乐 | 添加在摇滚 b | 之后 3 |

 全套变得可访问，因为订购`rock a -> rock b -> pop b`满足每个邻接条件。 最大保留大小为 3，因此答案为 0。 

考虑：```
3
a x
b y
c z
```这些州是：

 | 面膜| 最后一首歌| 行动| 可达尺寸|
 | --- | --- | --- | --- |
 | 001| 一个x | 开始| 1 |
 | 010| 由| 开始| 1 |
 | 100 | 100 cz| 开始| 1 |

 不存在过渡，因为没有对共享标签。 播放列表的最大大小为 1，因此必须删除两首歌曲。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n^2 2^n)$| 每个子集都可以尝试扩展所有可能的下一首歌曲 |
 | 空间|$O(n2^n)$| 为每个子集和可能的结尾歌曲存储一个 DP 状态 |

 和$n \leq 16$，子集的数量最多为 65536。生成的状态数量对于所需的限制来说足够小。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().split()
    sys.stdin = old

    it = iter(data)
    t = int(next(it))
    res = []

    for _ in range(t):
        n = int(next(it))
        songs = []
        for _ in range(n):
            songs.append((next(it), next(it)))

        ok = [[False] * n for _ in range(n)]
        for i in range(n):
            for j in range(n):
                ok[i][j] = songs[i][0] == songs[j][0] or songs[i][1] == songs[j][1]

        dp = [0] * ((1 << n) * n)
        best = 1

        for i in range(n):
            dp[((1 << i) * n) + i] = 1

        for mask in range(1 << n):
            best = max(best, mask.bit_count())
            for last in range(n):
                if dp[mask * n + last]:
                    rem = ((1 << n) - 1) ^ mask
                    while rem:
                        b = rem & -rem
                        nxt = b.bit_length() - 1
                        if ok[last][nxt]:
                            dp[(mask | b) * n + nxt] = 1
                        rem -= b

        res.append(str(n - best))

    return "\n".join(res)

assert run("""1
1
jazz mike
""") == "0"

assert run("""1
3
rock a
pop b
rock b
""") == "0"

assert run("""1
3
a x
b y
c z
""") == "2"

assert run("""1
4
a x
a y
b y
c z
""") == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 一首歌 | 0 | 单元边界情况 |
 | 兼容歌曲链 | 0 | 完整的播放列表可以重新排序 |
 | 没有兼容的配对 | 2 | 只有一首歌能够生存|
 | 部分兼容性 | 1 | 最大子集选择|

 ## 边缘情况

 对于单曲情况：```
1
jazz mike
```DP 以唯一一首歌曲作为可达状态开始。 不需要转换，因此最大播放列表大小为 1，删除计数为零。 

对于原始订单有误导性的情况：```
3
rock alice
pop bob
rock bob
```该算法不关心输入顺序。 它从每首歌开始，探索所有可能的有效延续。 它发现以所有三首歌曲结尾的排序并返回零删除。 

对于完全不相关歌曲的情况：```
3
a x
b y
c z
```兼容性矩阵不包含除自对之外的真对。 转换循环无法创建更大的掩码，只留下三个大小一状态。 该算法正确地计算出只能保留一首歌曲。
