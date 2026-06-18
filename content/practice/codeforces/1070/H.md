---
title: "CF 1070H - BerOS 文件建议"
description: "我们获得了固定的短文件名集合和查询流。 每个查询都是一个短字符串，我们必须确定有多少文件名包含该字符串作为连续子字符串。"
date: "2026-06-15T13:55:49+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1070
codeforces_index: "H"
codeforces_contest_name: "2018-2019 ICPC, NEERC, Southern Subregional Contest (Online Mirror, ACM-ICPC Rules, Teams Preferred)"
rating: 1500
weight: 1070
solve_time_s: 379
verified: false
draft: false
---

[CF 1070H - BerOS 文件建议](https://codeforces.com/problemset/problem/1070/H)

 **评分：** 1500
 **标签：** 暴力破解、实施
 **求解时间：** 6m 19s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们获得了固定的短文件名集合和查询流。 每个查询都是一个短字符串，我们必须确定有多少文件名包含该字符串作为连续子字符串。 除了计数之外，我们还需要返回包含查询字符串的任何一个文件名，如果没有文件匹配，则返回一个破折号。 

一个关键的结构细节是文件名非常短，最多 8 个字符。 这意味着每个文件仅包含少量子字符串，并且每个可能的子字符串也很短。 这强烈表明我们可以预先计算所有文件的子字符串信息，而不必担心内存或时间爆炸。 

输入大小也强化了这个方向。 最多有 10,000 个文件和最多 50,000 个查询。 对所有文件进行每次查询扫描会太慢，因为在最坏的情况下会导致 5 亿次子字符串检查。 每次检查都很便宜，但在 3 秒的限制下规模仍然太大。 我们需要预处理将每个查询变成 O(1) 或接近 O(1) 的查找。 

一个微妙的边缘情况是单个文件名中重复的子字符串。 如果一个文件是`"aaaa"`, 子串`"aa"`在其中多次出现，但它仍然只对计数有贡献一次。 另一个边缘情况是任何文件中都不存在的查询，我们必须返回`0 -`而不是空文件名或垃圾默认值。 

## 方法

 天真的想法很简单。 对于每个查询，迭代所有文件名并检查查询字符串是否显示为子字符串。 由于每个文件的长度最多为 8，因此子字符串检查实际上是常数时间，但我们仍然对每个查询的所有文件执行它。 这导致大约$O(n \cdot q \cdot L)$行为，这远远超出了限制$n = 10^4$和$q = 5 \cdot 10^4$。 

失败点就是重复。 即使文件集是静态的，我们也会为每个查询一次又一次地重新计算相同的子字符串关系。 该结构建议颠倒视角：我们可以预先计算每个可能的子字符串哪些文件包含它，而不是询问每个查询哪些文件包含它。 

每个文件仅贡献少量子字符串，因为长度最多为 8。对于长度为 8 的字符串$L$，子串的数量为$L(L+1)/2$，最多为 36。在 10,000 个文件中，这仅出现了大约 360,000 个子字符串。 它足够小，可以存储在哈希图中。 

关键的改进是构建一个字典，将每个子字符串映射到两条信息：有多少个不同的文件包含它，以及一个包含它的示例文件名。 一旦完成此预处理，每个查询就变成直接查找。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n \cdot q \cdot L)$|$O(1)$| 太慢了 |
 | 最优（预计算子字符串）|$O(n \cdot L^2 + q)$|$O(n \cdot L^2)$| 已接受 |

 ## 算法演练

 我们处理文件列表一次并在所有子字符串上构建全局索引。 

1. 对于每个文件名，生成所有不同的子字符串。 我们对每个文件使用一个集合，以便重复的字符不会导致同一文件的子字符串重复计数。 当相同的子字符串在单个文件中多次出现时，这可以确保正确性。 
2. 对于文件的每个唯一子字符串，更新全局字典。 如果子字符串尚不存在，则将其计数初始化为零并存储当前文件作为其示例。 然后将其计数加一。 存储的示例在初始化后不需要更新，因为任何有效的文件都是可接受的。 
3. 预处理完所有文件后，通过检查字典中是否存在来处理每个查询。 如果是，则输出存储的计数和示例文件。 如果不存在，则输出零和破折号。 

之所以高效，是因为所有昂贵的工作都集中在预处理中，并且每个查询都变成了恒定时间的哈希查找。 

### 为什么它有效

 每个子字符串都与包含它的文件集相关联，并且我们使用每个文件的重复数据删除集为每个文件记录一次成员身份。 因此，全局计数器表示包含该子字符串的不同文件的数量。 由于查询仅从该预先计算的映射中读取，因此没有查询依赖于运行时扫描或部分重新计算，因此答案与整个文件集中子字符串出现的定义一致。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def all_substrings(s: str):
    res = set()
    n = len(s)
    for i in range(n):
        cur = []
        for j in range(i, n):
            cur.append(s[j])
            res.add("".join(cur))
    return res

def main():
    n = int(input())
    files = [input().strip() for _ in range(n)]

    mp = {}

    for name in files:
        subs = all_substrings(name)
        for sub in subs:
            if sub not in mp:
                mp[sub] = [0, name]
            mp[sub][0] += 1

    q = int(input())
    out = []

    for _ in range(q):
        s = input().strip()
        if s in mp:
            out.append(f"{mp[s][0]} {mp[s][1]}")
        else:
            out.append("0 -")

    print("\n".join(out))

if __name__ == "__main__":
    main()
```功能`all_substrings`使用集合构建文件名的所有不同子字符串。 这可以避免过度计数的情况，例如重复字符，其中相同的子字符串可能会在一个文件中多次出现。 

字典`mp`为每个子字符串存储一对由其跨文件的频率和一个代表性文件名组成的对。 该代表在第一次遇到时就固定了，因为任何有效的答案都是可以接受的。 

每个查询都通过单个字典查找来解决，这确保了立即响应。 

## 工作示例

 考虑样本输入。 

文件是`"test"`,`"contests"`,`"test."`， 和`".test"`。 

对于查询`"ts"`，我们检查哪些文件包含它。 两个都`"contests"`和`"test."`包含`"ts"`，因此计数为 2，并且可以返回任一文件。 

| 查询 | 查询结果 | 计数 | 示例文件 |
 | ---| ---| ---| ---|
 | ts | 发现 | 2 | 比赛|
 | 。 | 发现 | 2 | .测试|
 | 故事。 | 发现 | 1 | 测试。 |
 | 圣 | 发现 | 4 | 测试|

 此跟踪显示，一旦完成预处理，每个查询都会减少为直接哈希表访问。 

现在考虑一个小型定制案例。 

文件：`"aaa"`,`"aba"`询问：`"aa"`| 文件 | 子串贡献 |
 | ---| ---|
 | 啊啊| 啊，啊啊|
 | 阿坝| ab、ba、aba |

 聚合后，`"aa"`以示例映射到计数 1`"aaa"`。 

这证实了文件内的重复出现不会增加计数。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n \cdot L^2 + q)$| 每个文件最多贡献 36 个子字符串，每次查询都是 O(1) 查找 |
 | 空间|$O(n \cdot L^2)$| 存储在哈希映射中的文件中的所有不同子字符串 |

 和$n \le 10^4$和$L \le 8$，预处理最多产生约 360,000 个子串，这很容易管理。 查询时间仅与查询数量成线性关系，因此该解决方案完全符合限制。 

## 测试用例```python
import sys, io

def solve():
    import sys
    input = sys.stdin.readline

    def all_substrings(s: str):
        res = set()
        n = len(s)
        for i in range(n):
            cur = []
            for j in range(i, n):
                cur.append(s[j])
                res.add("".join(cur))
        return res

    n = int(input())
    files = [input().strip() for _ in range(n)]

    mp = {}
    for name in files:
        subs = all_substrings(name)
        for sub in subs:
            if sub not in mp:
                mp[sub] = [0, name]
            mp[sub][0] += 1

    q = int(input())
    out = []
    for _ in range(q):
        s = input().strip()
        if s in mp:
            out.append(f"{mp[s][0]} {mp[s][1]}")
        else:
            out.append("0 -")
    return "\n".join(out)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return solve()

# provided sample
assert run("""4
test
contests
test.
.test
6
ts
.
st.
.test
contes.
st
""") == """1 contests
2 .test
1 test.
1 .test
0 -
4 test."""

# single character files
assert run("""2
a
b
3
a
b
c
""") == """1 a
1 b
0 -"""

# repeated characters inside file
assert run("""1
aaaa
3
a
aa
aaa
""") == """1 a
1 a
1 a"""

# no matches
assert run("""3
abc
def
ghi
2
zzz
xy
""") == """0 -
0 -"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单字符文件 | 直接匹配| 基本正确性 |
 | 重复字符| 没有重复计算| 每个文件重复数据删除 |
 | 没有匹配项 |`0 -`处理| 缺少子字符串大小写 |

 ## 边缘情况

 像这样的文件`"aaaa"`是主要的陷阱案例。 直接计算子字符串出现次数的粗心方法会计数`"aa"`在同一个文件中多次。 正确的行为需要将每个文件视为每个子字符串的单个贡献者。 

对于输入：```
1
aaaa
1
aa
```预处理步骤生成子字符串`{a, aa, aaa, aaaa}`。 虽然`"aa"`出现在多个位置，它只插入到每个文件集中一次，因此全局计数变为 1。查询正确输出`1 aaaa`。 

第二个边缘情况是查询子字符串没有出现在任何文件中。 对于输入：```
2
abc
def
1
z
```字典查找失败，输出为`0 -`。 这确保我们不会尝试访问未定义的示例文件名或从初始化中生成过时的值。
