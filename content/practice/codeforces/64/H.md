---
title: "CF 64H - 桌上保龄球"
description: "我们得到了桌上保龄球锦标赛的最终排名。 每个参与者都有一个唯一的名字和一个整数分数。 任务不仅是对选手进行排序，还要按照真实锦标赛中使用的风格分配排名标签。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special", "sortings"]
categories: ["algorithms"]
codeforces_contest: 64
codeforces_index: "H"
codeforces_contest_name: "Unknown Language Round 1"
rating: 2300
weight: 64
solve_time_s: 112
verified: true
draft: false
---

[CF 64H - 桌上保龄球](https://codeforces.com/problemset/problem/64/H)

 **评分：** 2300
 **标签：** *特殊、排序
 **求解时间：** 1m 52s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了桌上保龄球锦标赛的最终排名。 每个参与者都有一个唯一的名字和一个整数分数。 任务不仅是对选手进行排序，还要按照真实锦标赛中使用的风格分配排名标签。 

玩家主要按分数递减排序。 如果两个玩家得分相同，则他们的名字按字典顺序决定顺序。 排序后，我们必须输出每个参与者及其位置。 

棘手的部分是正确处理领带。 如果多名玩家得分相同，则他们的名次范围也相同。 例如，如果三名球员占据位置 5、6 和 7，因为他们的得分都是 100，那么他们中的每一位都必须获得标签`5-7`。 

输入尺寸很小。 最多有 100 名参与者，因此即使是二次解也是完全安全的。 一个简单的排序就已经解决了几乎所有的问题。 真正的挑战是正确格式化排名间隔。 

危险的边缘情况都与关系有关。 

考虑这个输入：```
3
alice 10
bob 10
carol 10
```所有三名玩家共享位置 1 到 3，因此正确的输出是：```
1-3 alice
1-3 bob
1-3 carol
```粗心的实现可能会打印：```
1 alice
2 bob
3 carol
```这会错误地将不同的排名分配给并列的分数。 

当平局发生在桌子中间时，会出现另一种微妙的情况：```
5
anna 100
bella 90
claire 90
diana 80
eva 70
```正确的输出是：```
1 anna
2-3 bella
2-3 claire
4 diana
5 eva
```平局后的下一个排名必须从实际占据的位置继续。 位置 2 和位置 3 共享后，下一个参与者将获得位置 4，而不是位置 3。 

另一种经常导致差一错误的情况是最后平局：```
4
a 5
b 4
c 1
d 1
```正确的输出是：```
1 a
2 b
3-4 c
3-4 d
```在处理分组分数时，我们必须仔细计算区间边界。 

## 方法

 蛮力的想法很简单。 首先按分数降序和姓名升序对所有参与者进行排序。 然后，对于每个参与者，扫描整个数组以计算有多少玩家共享相同的分数，并确定该分数组的第一个和最后一个位置。 

这是可行的，因为约束很小。 最多 100 名玩家，`O(n^2)`在最坏的情况下 scan 仅执行大约 10,000 次比较。 

尽管如此，重复的重新扫描是不必要的。 排序后，分数相等的就成为连续的。 这一观察结果将问题从“全局搜索匹配分数”转变为“处理连续组”。 

一旦数组排序完毕，我们就可以从左到右遍历它。 假设指数`i ... j`所有人都有相同的分数。 然后这些球员占据位置`i + 1 ... j + 1`在排名中，因为排名是从 1 开始的。 

如果`i == j`，玩家有一个唯一的排名，所以我们打印一个数字。 否则，整个组共享间隔`i+1 - j+1`。 

这种分组起作用的原因是排序已经同时保证了两个属性。 分数按排名顺序出现，相同的分数形成一个连续的区块。 这意味着每个绑定组都可以在一次传递中独立处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(n) | 已接受 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 将所有参与者读入一个数组`(name, score)`对。 
2. 使用两个键对数组进行排序：

 - 分数按降序排列
 - 名称按字典顺序升序排列

 这会产生语句所需的精确输出顺序。 
3. 初始化索引`i = 0`。 
4. 虽然`i < n`，找到具有相同分数的玩家的最大分段。 

启动另一个指针`j = i`，然后移动`j`前进，而下一个参与者的分数相同。 
5. 指数参与者`i ... j`占据排名位置`i + 1 ... j + 1`。 

排名从 1 开始，因此数组索引 0 对应于位置 1。 
6. 如果`i == j`， 打印：```
place name
```否则，打印：```
start-end name
```对于小组中的每个参与者。 
7. 设置`i = j + 1`并继续处理下一个分数组。 

### 为什么它有效

 排序后，得分较高的每个参与者都会出现在数组中较靠前的位置。 得分相同的参与者会连续出现，因为他们在主要排序键上的比较是相等的。 

对于占用索引的组`i ... j`， 确切地`i`参与者的分数严格较高，因此第一个有效位置是`i + 1`。 确切地`j + 1`参与者的分数至少一样高，所以最后占据的位置是`j + 1`。 

该组的每个成员都会收到相同的间隔，这与锦标赛排名定义相匹配。 由于每个参与者都属于一个连续的分数组，因此算法会为​​所有玩家分配正确的位置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    
    players = []
    
    for _ in range(n):
        name, score = input().split()
        players.append((name, int(score)))
    
    players.sort(key=lambda x: (-x[1], x[0]))
    
    ans = []
    
    i = 0
    
    while i < n:
        j = i
        
        while j + 1 < n and players[j + 1][1] == players[i][1]:
            j += 1
        
        left = i + 1
        right = j + 1
        
        for k in range(i, j + 1):
            name = players[k][0]
            
            if left == right:
                ans.append(f"{left} {name}")
            else:
                ans.append(f"{left}-{right} {name}")
        
        i = j + 1
    
    print("\n".join(ans))

solve()
```第一阶段将所有参与者读入成对的列表中。 使用元组可以在排序和处理过程中将名称和分数保持在一起。 

排序键值得关注。 我们首先想要更高的分数，所以分数被否定。 名称保持正常升序，这会自动按字典顺序解决关系。 

主循环一次处理一个乐谱组。 指针`i`标记当前组的开始，而`j`扩展到最后一个得分相同的参与者。 

排名区间直接来自指数。 由于排名从 1 而不是 0 开始，因此两个边界都会向索引添加 1。 

条件`left == right`将唯一等级与共享范围区分开来。 如果没有此检查，单个玩家将错误地接收类似的输出`3-3 alice`。 

最后，`i = j + 1`直接跳转到下一个未处理的乐谱组。 

## 工作示例

 ### 示例 1

 输入：```
5
vasya 10
ted 11
petya 10
katya 33
mike 44
```排序后：

 | 索引 | 名称 | 分数 |
 | ---| ---| ---|
 | 0 | 迈克| 44 | 44
 | 1 | 卡蒂亚 | 33 | 33
 | 2 | 特德 | 11 | 11
 | 3 | 佩蒂亚| 10 | 10
 | 4 | 瓦夏 | 10 | 10

 处理痕迹：

 | 我| j | 分数组| 排名间隔 | 输出|
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 迈克| 1 | 1 个麦克风 |
 | 1 | 1 | 卡蒂亚| 2 | 2 卡蒂亚 |
 | 2 | 2 | 特德 | 3 | 3 特德 |
 | 3 | 4 | 瓦夏·佩蒂亚| 4-5 | 4-5 佩蒂亚、4-5 瓦西亚 |

 最终输出：```
1 mike
2 katya
3 ted
4-5 petya
4-5 vasya
```该轨迹演示了排序后相等的分数如何自然地成为一个连续的块。 最后两名选手共用 4 号位和 5 号位。 

### 示例 2

 输入：```
6
anna 50
bella 50
claire 50
diana 20
eva 10
flora 10
```排序后：

 | 索引 | 名称 | 分数 |
 | ---| ---| ---|
 | 0 | 安娜 | 50 | 50
 | 1 | 贝拉 | 50 | 50
 | 2 | 克莱尔 | 50 | 50
 | 3 | 戴安娜 | 20 |
 | 4 | 伊娃 | 10 | 10
 | 5 | 植物区系 | 10 | 10

 处理痕迹：

 | 我| j | 分数组| 排名间隔 | 输出|
 | ---| ---| ---| ---| ---|
 | 0 | 2 | 安娜、贝拉、克莱尔 | 1-3 | 1-3 共享 |
 | 3 | 3 | 戴安娜 | 4 | 独特|
 | 4 | 5 | 伊娃，弗洛拉| 5-6 | 共享 |

 最终输出：```
1-3 anna
1-3 bella
1-3 claire
4 diana
5-6 eva
5-6 flora
```此示例练习两个不同的联系组，并确认下一个排名在共享间隔后正确继续。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 排序主导运行时间 |
 | 空间| O(n) | 参与者列表和输出列表存储所有玩家|

 由于只有 100 名参与者，该解决方案很容易满足限制。 即使慢得多的方法也能轻松通过，但排序后的分组线性扫描是干净且可扩展的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    
    input = sys.stdin.readline
    
    def solve():
        n = int(input())
        
        players = []
        
        for _ in range(n):
            name, score = input().split()
            players.append((name, int(score)))
        
        players.sort(key=lambda x: (-x[1], x[0]))
        
        ans = []
        
        i = 0
        
        while i < n:
            j = i
            
            while j + 1 < n and players[j + 1][1] == players[i][1]:
                j += 1
            
            left = i + 1
            right = j + 1
            
            for k in range(i, j + 1):
                name = players[k][0]
                
                if left == right:
                    ans.append(f"{left} {name}")
                else:
                    ans.append(f"{left}-{right} {name}")
            
            i = j + 1
        
        return "\n".join(ans)
    
    return solve()

# provided sample
assert run(
"""5
vasya 10
ted 11
petya 10
katya 33
mike 44
"""
) == (
"""1 mike
2 katya
3 ted
4-5 petya
4-5 vasya"""
), "sample 1"

# minimum size
assert run(
"""1
alice 100
"""
) == (
"""1 alice"""
), "single participant"

# all equal scores
assert run(
"""3
c 5
a 5
b 5
"""
) == (
"""1-3 a
1-3 b
1-3 c"""
), "all tied"

# tie in the middle
assert run(
"""5
anna 100
bella 90
claire 90
diana 80
eva 70
"""
) == (
"""1 anna
2-3 bella
2-3 claire
4 diana
5 eva"""
), "middle tie"

# tie at the end
assert run(
"""4
a 5
b 4
c 1
d 1
"""
) == (
"""1 a
2 b
3-4 c
3-4 d"""
), "ending tie"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单人参加 |`1 alice`| 最小输入尺寸 |
 | 分数均等 |`1-3 ...`| 整个表共享一个等级范围 |
 | 中间打结|`2-3 ...`| 平局后正确的延续 |
 | 最后打结|`3-4 ...`| 最后一组的正确性差一分|

 ## 边缘情况

 考虑每个参与者得分相同的情况：```
4
dan 50
anna 50
mike 50
bob 50
```在相等分数内按字典顺序排序后：```
anna 50
bob 50
dan 50
mike 50
```该算法开始于`i = 0`并扩展`j`直到`j = 3`因为每个分数都匹配。 间隔变为`1-4`，为每个参与者打印：```
1-4 anna
1-4 bob
1-4 dan
1-4 mike
```这证实了一个大的得分块已被正确处理。 

现在只考虑一开始的平局：```
4
alice 100
bob 100
carol 90
dave 80
```第一组占用索引`0..1`，所以两个玩家都会收到`1-2`。 下一个参与者从索引处开始`2`，对应地点`3`。 

输出：```
1-2 alice
1-2 bob
3 carol
4 dave
```这验证了排名在并列组的完整大小之后继续，而不是在其第一个位置之后。 

最后，考虑关系内的字典顺序：```
3
zack 10
anna 10
mike 10
```所有分数都是相等的，因此名称决定顺序：```
anna
mike
zack
```该算法输出：```
1-3 anna
1-3 mike
1-3 zack
```如果没有按名称进行二次排序，即使排名间隔本身正确，输出顺序也会不正确。
